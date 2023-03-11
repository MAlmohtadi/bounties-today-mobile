import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import OrderCard from '_organisms/OrderCard';
import {
  cancelOrder,
  removeItemProduct,
  removeProduct,
  addItemProduct,
  confirmUpdateOrderProducts,
  clearOrdersProducts,
  getOrderProducts,
} from '_actions/orderActions';
import { FlatList, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Card from '_organisms/Card';
import { Button } from 'react-native-elements';
import LoadingSpinner from '_organisms/LoadingSpinner';
import AlertMessage from '_organisms/AlertMessage';

const EditOrderScreen = ({
  navigation,
  orderReducer: {
    order: {
      orderId,
      products: [],
      orderedProducts = [],
      isUpdated,
      isOrderProductLoading,
      cancelledDate,
      deliveryDate,
      deliveryPrice,
      isCancelled,
      orderDate,
      statusId,
      couponInfo = {}
    },
  },
  authReducer: { id: userId },
  homeReducer: {
    isWholeSale,
    adminSettingsResponse: {
      maxTotalPriceRetail,
      maxTotalPriceWholeSale,
      minTotalPriceRetail,
      minTotalPriceWholeSale,
    },
  },
  cancelOrder,
  removeItemProduct,
  removeProduct,
  addItemProduct,
  clearOrdersProducts,
  confirmUpdateOrderProducts,
  getOrderProducts,

}) => {
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [visibleAlert2, setVisibleAlert2] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [isUpdatedSuccessful, setIsUpdatedSuccessful] = useState(false);
  const { minOrderPrice, isPercentage, percentage, discountAmount } = couponInfo || {}
  let totalPrice = 0;
  let quantity = 0;
  let offerQuantity = 0;
  let totalPriceEligibleForDiscount = 0;
  let totalPriceNotEligibleForDiscount = 0;
  orderedProducts.map((product) => {
    if (product.isOffer) {
      quantity = product.quantity;
      offerQuantity = product.offerQuantity;
      if (offerQuantity === 0) {
        offerQuantity = 1;
      }
      while (quantity > 0 && quantity >= product.offerQuantity) {
        totalPriceNotEligibleForDiscount += product.offerPrice;
        quantity -= offerQuantity;
      }
      if (quantity > 0) {
        totalPriceEligibleForDiscount  += product.price * quantity;
      }
    } else {
      totalPriceEligibleForDiscount += product.price * product.quantity;
    }
  });
  // totalPrice = Number(totalPrice).toFixed(2);
  totalPriceEligibleForDiscount = Number(totalPriceEligibleForDiscount.toFixed(2));
  totalPriceNotEligibleForDiscount = Number(totalPriceNotEligibleForDiscount.toFixed(2));

  const getTotalAmount = () => {
    return (deliveryPrice + totalPriceNotEligibleForDiscount+ totalPriceEligibleForDiscount - getDiscountAmount()).toFixed(2);
  };

  const getDiscountAmount = () => {
    if (minOrderPrice && totalPriceEligibleForDiscount >= minOrderPrice) {
      return (
        isPercentage ? totalPriceEligibleForDiscount * (percentage / 100) : discountAmount
      ).toFixed(2);
    }
    return 0;
  };
  const onSubmitUpdate = () => {
    const minValidation = isWholeSale
      ? minTotalPriceWholeSale
      : minTotalPriceRetail;
    const maxValidation = isWholeSale
      ? maxTotalPriceWholeSale
      : maxTotalPriceRetail;
    if (minValidation && totalPriceEligibleForDiscount < minValidation) {
      setErrorMessage(`الحد الادنى للطلب هو ${minValidation} دينار`);
      setVisibleAlert2(true);
      return;
    }
    if (maxValidation && totalPriceEligibleForDiscount > maxValidation) {
      setErrorMessage(`الحد الأعلى للطلب هو ${maxValidation} دينار`);
      setVisibleAlert2(true);
      return;
    }
    confirmUpdateOrderProducts({
      isWholeSale,
      userId,
      orderId,
      orderedProducts: orderedProducts,
      totalPrice: getTotalAmount(),
      couponDiscount: getDiscountAmount()
    });
    setIsUpdatedSuccessful(true);
  };
  useEffect(() => {

    const unsubscribe = [navigation.addListener('focus', () => {
      if (orderId && isOrderProductLoading) {
        getOrderProducts({
          orderId,
          userId,
        });
      }
    }), navigation.addListener('blur', () => {
      clearOrdersProducts();
    })]

    if (isCancelled) {
      clearOrdersProducts();
      navigation.goBack();
    }
    if (!isUpdated && isUpdatedSuccessful) {
      setErrorMessage("تم تعديل طلبك بنجاح")
      setVisibleAlert2(true)
      setIsUpdatedSuccessful(false)
    }
    return () => {
      unsubscribe.forEach(unSub => {
        unSub();
      })
    };
  }, [
    navigation,
    orderId,
    isOrderProductLoading,
    isCancelled,
    userId,
    isUpdated
  ]);
  return isOrderProductLoading ? (
    <LoadingSpinner />
  ) : (
    <View style={{ flex: 1, position: 'relative', backgroundColor: '#F7F7F7' }}>
      <OrderCard
        editable={false}
        order={{
          cancelledDate,
          deliveryDate,
          id: orderId,
          isCancelled,
          orderDate,
          statusId,
          totalPrice: getTotalAmount(),
        }}
        onPressCancel={() => {
          setVisibleAlert(true);
        }}
        onPressView={() => { }}
      />

      <FlatList
        style={{
          flex: 1,
          marginTop: 5,
          paddingHorizontal: 10,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ paddingBottom: hp(15), paddingHorizontal: 2 }]}
        data={orderedProducts.filter(product => !product.isCancelled)}
        onEndReachedThreshold={0.4}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item, index }) => (
          <Card
            key={`card-${item.id}`}
            product={item}
            quantity={item.quantity}
            showFavoriteIcon={false}
            showStockStatus={false}
            showTrushIcon
            onClickTrushIcon={() => removeProduct(item.id)}
            addToCart={() => addItemProduct(item.id)}
            removeFromCart={() => removeItemProduct(item.id)}
          />
        )}
      />
      {isUpdated && (
        <Button
          onPress={() => {
            onSubmitUpdate()
          }}
          raised
          type="clear"
          title="تأكيد"
          titleStyle={{ color: '#fff', fontFamily: 'Tajawal-Bold' }}
          containerStyle={{

            position: 'absolute',
            bottom: widthPercentageToDP(32),
            left: widthPercentageToDP(30),
            borderWidth: 1,
            borderColor: '#61012D',
            backgroundColor: '#61012D',
            width: widthPercentageToDP(40),
          }}
          useForeground
        />
      )}
      <AlertMessage
        visible={visibleAlert}
        message={'هل انت متأكد من إلغاء الطلب'}
        buttonText="نعم"
        buttonText2="لا"
        buttonAction={() => {
          cancelOrder({ isWholeSale, orderId, userId });
          setVisibleAlert(false);
        }}
        buttonAction2={() => {
          setVisibleAlert(false);
        }}
      />
      <AlertMessage
        visible={visibleAlert2}
        message={errorMessage}
        buttonText="تم"
        buttonAction={() => {
          setVisibleAlert2(false);
        }}
      />
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    orderReducer: state.orderReducer,
    authReducer: state.authReducer,
    homeReducer: state.homeReducer,
  };
};
export default connect(mapStateToProps, {
  cancelOrder,
  removeItemProduct,
  removeProduct,
  addItemProduct,
  confirmUpdateOrderProducts,
  clearOrdersProducts,
  getOrderProducts,
})(EditOrderScreen);
