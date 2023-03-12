import React, { Fragment, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Button } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import CartIcon from '_icons/cart_icon';
import Card from '_organisms/Card';
import EmptyIconWithDescription from '_organisms/EmptyIconWithDescription';
import {
  addToCart,
  removeFromCart,
  deleteProductFromCart,
  clearCart,
} from '_actions/cartActions';
import TrushIcon from '_icons/trush.svg';
import Pages from '../navigations/Pages';
import AlertMessage from '_organisms/AlertMessage';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const CartScreen = ({
  navigation,
  addToCart,
  clearCart,
  removeFromCart,
  deleteProductFromCart,
  cartReducer,
  cartWholesaleReducer,
  homeReducer: {
    isWholeSale,
    adminSettingsResponse: {
      maxTotalPriceRetail,
      maxTotalPriceWholeSale,
      minTotalPriceRetail,
      minTotalPriceWholeSale,
    },
  },
}) => {
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { products = [], quantities = {} } = isWholeSale
    ? cartWholesaleReducer
    : cartReducer;
  let totalPrice = 0;
  let quantity = 0;
  let offerQuantity;
  products.map((product) => {
    if (product.isOffer) {
      quantity = quantities[`${product.id}`];
      offerQuantity = product.offerQuantity;
      if (offerQuantity === 0) {
        offerQuantity = 1;
      }
      while (quantity > 0 && quantity >= offerQuantity) {
        totalPrice += product.offerPrice;
        quantity -= offerQuantity;
      }
      if (quantity > 0) {
        totalPrice += product.price * quantity;
      }
    } else {
      totalPrice += product.price * quantities[`${product.id}`];
    }
  });
  totalPrice = Number(totalPrice.toFixed(2));
  const onSubmit = () => {
    const minValidation = isWholeSale
      ? minTotalPriceWholeSale
      : minTotalPriceRetail;
    const maxValidation = isWholeSale
      ? maxTotalPriceWholeSale
      : maxTotalPriceRetail;
    if (minValidation && totalPrice < minValidation) {
      setErrorMessage(`الحد الادنى للطلب هو ${minValidation} دينار`);
      setVisibleAlert(true);
      return;
    }
    if (maxValidation && totalPrice > maxValidation) {
      setErrorMessage(`الحد الأعلى للطلب هو ${maxValidation} دينار`);
      setVisibleAlert(true);
      return;
    }
    navigation.navigate(Pages.Checkout.route);
  };
  return (
    <View style={styles.mainContainer}>
      {products.length === 0 ? (
        <Fragment>
          <View />
          <View style={{ alignItems: 'center' }}>
            <EmptyIconWithDescription
              iconComponent={
                <CartIcon width={wp(5)} style={{ aspectRatio: 1 }} />
              }
              description="سلة المشتريات فارغة !"
            />
          </View>
          <Button
            onPress={() => {
              navigation.goBack();
            }}
            type="clear"
            title="إكمال التسوق"
            titleStyle={{ color: '#fff', fontFamily: fonts.bold }}
            useForeground
            containerStyle={[
              styles.buttonStyle,
              {
                backgroundColor: colors.primaryColor,
                marginHorizontal: wp(2),
                marginBottom: 15,
                flex: null
              },
            ]}
          />
        </Fragment>
      ) : (
        <Fragment>
          <View style={styles.topContainer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => clearCart(isWholeSale)}>
              <TrushIcon
                width={wp(4)}
                style={{ marginRight: wp(2), aspectRatio: 1 }}
              />
              <Text style={styles.clearTitle}>إفراغ السلة</Text>
            </TouchableOpacity>
            <View style={styles.totalPriceContainer}>
              <Text style={styles.totalPrice}>
                {Math.round(totalPrice * 100) / 100 + ' JD  '} المبلغ الإجمالي
              </Text>
            </View>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            enabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuViewScrollContainer}>
            {products.map((item) => (
              <Card
                key={item.id}
                product={item}
                quantity={
                  isWholeSale
                    ? cartWholesaleReducer.quantities[`${item.id}`]
                    : cartReducer.quantities[`${item.id}`]
                }
                deleteFromCart={deleteProductFromCart}
                addToCart={(item) => addToCart(item, isWholeSale)}
                removeFromCart={(item) => removeFromCart(item, isWholeSale)}
              />
            ))}
            <View style={{ height: hp(15) }} />
          </ScrollView>
          <View style={styles.bottomContainer}>
            <Button
              onPress={onSubmit}
              type="clear"
              useForeground
              title="تنفيذ الطلب"
              titleStyle={{ color: '#fff', fontFamily: fonts.bold }}
              containerStyle={[styles.buttonStyle, { backgroundColor: colors.primaryColor }]}
            />
            <View style={{ width: 15 }} />
            <Button
              onPress={() => navigation.goBack()}
              type="clear"
              useForeground
              title="إكمال التسوق"
              titleStyle={{ color: colors.primaryColor, fontFamily: fonts.bold }}
              containerStyle={styles.buttonStyle}
            />
          </View>
          <AlertMessage
            visible={visibleAlert}
            message={errorMessage}
            buttonText="تم"
            buttonAction={() => setVisibleAlert(false)}
          />
        </Fragment>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    margin: 10,
    justifyContent: 'space-between',
    backgroundColor: '#FFFF',
    position: 'relative',
  },
  menuViewScrollContainer: {
    paddingHorizontal: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.2,
    elevation: 5,
  },
  titleStyle: {
    fontSize: wp(4.5),
    fontFamily: fonts.bold,
    color: 'white',
  },
  buttonStyle: {
    // paddingVertical: hp(1),
    // marginHorizontal: 10,
    flex: 1,
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: colors.primaryColor,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginHorizontal: 5,
  },
  clearButton: {
    flexDirection: 'row',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
    borderWidth: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    borderColor: '#FF0000',
  },
  clearTitle: {
    fontFamily: fonts.medium,
    fontSize: wp(3.2),
    color: '#FF0000',
  },
  totalPriceContainer: {
    backgroundColor: '#DED6DA',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(2),
  },
  totalPrice: {
    fontFamily: fonts.bold,
    fontSize: wp(3.8),
  },
  bottomContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = (state) => {
  return {
    cartReducer: state.cartReducer,
    cartWholesaleReducer: state.cartWholesaleReducer,
    homeReducer: state.homeReducer,
  };
};

export default connect(mapStateToProps, {
  addToCart,
  removeFromCart,
  deleteProductFromCart,
  clearCart,
})(CartScreen);
