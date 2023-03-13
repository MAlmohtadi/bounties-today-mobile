import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  View,
  Text,
  I18nManager,
} from 'react-native';
import Dash from 'react-native-dash';
import {Button, Icon, Input} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import DeliveryDetails from '_organisms/DeliveryDetails';
import {
  submitOrder,
  updateCheckoutDetails,
  getCheckoutInfo,
  getCouponByCode,
  clearCheckout,
  clearCoupon,
} from '_actions/checkoutActions';
import {clearCart} from '_actions/cartActions';

import Pages from '../navigations/Pages';
import AccountModal from '_organisms/AccountModal';
import AlertMessage from '_organisms/AlertMessage';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const CheckoutScreen = ({
  navigation,
  submitOrder,
  updateCheckoutDetails,
  getCheckoutInfo,
  getCouponByCode,
  clearCoupon,
  authReducer: {id: userId},
  homeReducer: {
    deliveryTerms,
    isWholeSale,
    adminSettingsResponse: {
      visaOnDeliveryEnabled,
      choose_delivery_period_enabled,
      chooseDeliveryEnabled,
    },
  },
  clearCheckout,
  clearCart,
  checkoutReducer: {
    location,
    typeOfPayment,
    deliveryDate,
    deliveryPeriod,
    deliveryPrice,
    notes,
    couponCode,
    branchId,
    deliveryInfo,
    orderSubmitted,
    couponInfo: {
      minOrderPrice,
      isPercentage,
      percentage,
      discountAmount,
      validate,
    },
  },
  cartReducer,
  cartWholesaleReducer,
}) => {
  const [visible, setVisible] = useState(false);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [visibleValidationAlert, setVisibleValidationAlert] = useState(false);
  const [validationMessage, setValidationMessage] = useState();

  const {products = [], quantities = {}} = isWholeSale
    ? cartWholesaleReducer
    : cartReducer;
  const [isLoading, setIsLoading] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  let totalPriceEligibleForDiscount = 0;
  let totalPriceNotEligibleForDiscount = 0;
  let orderedProducts = [];
  let quantity = 0;
  let offerQuantity = 0;
  products.map(product => {
    if (product.isOffer) {
      quantity = quantities[`${product.id}`];
      offerQuantity = product.offerQuantity;
      if (offerQuantity === 0) {
        offerQuantity = 1;
      }
      while (quantity > 0 && quantity >= offerQuantity) {
        totalPriceNotEligibleForDiscount += product.offerPrice;
        quantity -= offerQuantity;
      }
      if (quantity > 0) {
        totalPriceEligibleForDiscount += product.price * quantity;
      }
    } else {
      totalPriceEligibleForDiscount +=
        product.price * quantities[`${product.id}`];
    }
    orderedProducts.push({
      ...product,
      productId: product.id,
      id: null,
      quantity: quantities[`${product.id}`],
    });
  });
  totalPriceEligibleForDiscount = Number(
    totalPriceEligibleForDiscount.toFixed(2),
  );
  totalPriceNotEligibleForDiscount ==
    Number(totalPriceNotEligibleForDiscount.toFixed(2));
  const getTotalAmount = () => {
    return (
      deliveryPrice +
      totalPriceNotEligibleForDiscount +
      totalPriceEligibleForDiscount -
      getDiscountAmount()
    ).toFixed(2);
  };

  const getDiscountAmount = () => {
    if (minOrderPrice && totalPriceEligibleForDiscount >= minOrderPrice) {
      return (
        isPercentage
          ? totalPriceEligibleForDiscount * (percentage / 100)
          : discountAmount
      ).toFixed(2);
    }
    return 0;
  };
  useEffect(() => {
    const unsubscribe = [
      navigation.addListener('focus', () => {
        getCheckoutInfo();
      }),
      navigation.addListener('blur', () => {
        clearCheckout();
      }),
    ];
    if (userId) {
      setVisible(false);
    }
    if (orderSubmitted) {
      setVisibleAlert(true);
    }
    if (userId) {
      setIsLoading(false);
    }
    if (validate && totalPriceEligibleForDiscount < minOrderPrice) {
      setValidationMessage(
        `الحد الأدنى لإستخدام كوبون الخصم للمنتجات بدون عروض هو : ${minOrderPrice}`,
      );
      setVisibleValidationAlert(true);
    }
    return () => {
      unsubscribe.forEach(unSub => {
        unSub();
      });
    };
  }, [userId, orderSubmitted, validate]);
  const clearBeforeNavigation = routes => {
    // clearCheckout();
    clearCart(isWholeSale);
    // setIsLoading(false);
    navigation.reset({index: 0, routes: [...routes]});
    // setVisibleAlert(false);
  };
  const onSubmit = () => {
    if (!isLoading) {
      let message = 'يجب اختيار التالي:';
      if ((!chooseDeliveryEnabled && location) || (deliveryPrice && location)) {
        if (!userId) {
          toggleOverlay();
          return;
        }
        setIsLoading(true);
        submitOrder({
          branchId,
          couponCode,
          deliveryDate,
          deliveryPeriod,
          deliveryPrice,
          isWholeSale,
          location,
          notes,
          orderedProducts: orderedProducts,
          totalPrice: getTotalAmount(),
          typeOfPayment,
          userId,
          couponDiscount: getDiscountAmount(),
        });
      } else {
        message = location ? message : message + '\n\n - عنوان التوصيل';
        if (chooseDeliveryEnabled !== false) {
          message = !deliveryDate ? message + '\n\n - يوم التوصيل' : message;
          message =
            choose_delivery_period_enabled !== false && !deliveryPeriod
              ? message + '\n\n - وقت التوصيل'
              : message;
        }

        setValidationMessage(message);
        setVisibleValidationAlert(true);
      }
    }
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView keyboardShouldPersistTaps="handled" style={{flex: 1}}>
        <View style={{margin: hp(1.5), marginBottom: 5}}>
          <DeliveryDetails
            navigateToMapScreen={() => {
              navigation.navigate(Pages.Map.route);
            }}
            deliveryInfo={deliveryInfo}
            deliveryPeriod={deliveryPeriod}
            locationName={location}
            onSelectDate={deliveryDate => updateCheckoutDetails({deliveryDate})}
            onSelectPeriod={(deliveryPeriod, deliveryPrice) =>
              updateCheckoutDetails({deliveryPeriod, deliveryPrice})
            }
            chooseDeliveryEnabled={chooseDeliveryEnabled}
          />
        </View>
        <View
          style={{
            backgroundColor: 'white',
            marginRight: hp(1.5),
            marginLeft: hp(1.5),
          }}>
          <Text style={[styles.subTitle, {color: 'red'}]}>{deliveryTerms}</Text>
        </View>
        <View style={{backgroundColor: 'white'}}>
          <Input
            value={notes}
            onChangeText={value => updateCheckoutDetails({notes: value})}
            multiline
            placeholder="إضافة ملاحظة"
            textAlign="right"
            containerStyle={{paddingHorizontal: 0, marginVertical: 0}}
            inputContainerStyle={{borderBottomWidth: 0}}
            errorMessage={false}
            renderErrorMessage={null}
            inputStyle={styles.commentBox}
          />
        </View>
        {
          <View style={{margin: hp(1.5)}}>
            <Text style={styles.subTitle}>طريقة الدفع</Text>
            <View
              style={{
                flexDirection: !I18nManager.isRTL ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                marginVertical: 15,
              }}>
              {(visaOnDeliveryEnabled === null || visaOnDeliveryEnabled) && (
                <TouchableOpacity
                  onPress={() => updateCheckoutDetails({typeOfPayment: 2})}
                  style={[
                    styles.paymentButton,
                    typeOfPayment === 2 ? styles.activePaymentButton : null,
                  ]}>
                  <Text
                    style={[
                      styles.paymentText,
                      typeOfPayment === 2 ? {color: '#FFF'} : null,
                    ]}>
                    {' '}
                    دفع فيزا عند الإستلام
                  </Text>
                  <Icon name="payment" color={typeOfPayment === 2 && '#FFF'} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => updateCheckoutDetails({typeOfPayment: 1})}
                style={[
                  styles.paymentButton,
                  typeOfPayment === 1 ? styles.activePaymentButton : null,
                ]}>
                <Text
                  style={[
                    styles.paymentText,
                    typeOfPayment === 1 ? {color: '#FFF'} : null,
                  ]}>
                  {' '}
                  دفع نقداً عند الإستلام
                </Text>
                <Icon
                  type="material"
                  name="payments"
                  color={typeOfPayment === 1 && '#FFF'}
                />
              </TouchableOpacity>
            </View>
          </View>
        }
        <View
          style={{
            flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            backgroundColor: 'white',
            alignItems: 'center',
            padding: hp(1),
          }}>
          <TextInput
            value={couponCode}
            onChangeText={value => updateCheckoutDetails({couponCode: value})}
            placeholder="كود الخصم"
            textAlign="center"
            textAlignVertical="center"
            enablesReturnKeyAutomatically
            onEndEditing={() => {
              getCouponByCode({code: couponCode, userId});
            }}
            style={styles.coupone}
          />
          <View
            style={{
              flex: 1,
              flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.subTitle}> إضافة كوبون خصم</Text>
            <Icon
              type="material-community"
              name="ticket-percent-outline"
              color={colors.primaryColor}
              size={30}
            />
          </View>
        </View>
        <View
          style={{
            margin: 15,
            backgroundColor: colors.primaryColorBrighter,
            borderRadius: 10,
            padding: 10,
          }}>
          <Text style={styles.subTitle}>ملخص الدفع</Text>
          <View style={styles.textDetailContainer}>
            <Text style={styles.priceText}>
              {totalPriceEligibleForDiscount + totalPriceNotEligibleForDiscount}{' '}
              JD
            </Text>
            <Text style={styles.regularText}>المجموع</Text>
          </View>
          <View style={styles.textDetailContainer}>
            <Text style={styles.priceText}>{deliveryPrice} JD</Text>
            <Text style={styles.regularText}>رسوم التوصيل</Text>
          </View>
          <View style={styles.textDetailContainer}>
            <Text style={[styles.priceText, {color: '#FF0000'}]}>
              {getDiscountAmount()} JD
            </Text>
            <Text style={[styles.regularText, {color: '#FF0000'}]}>
              كوبون الخصم
            </Text>
          </View>
          <Dash
            dashGap={6}
            dashColor="#707070"
            dashLength={6}
            style={{flex: 1, height: 1, marginVertical: 5}}
          />
          <View style={styles.textDetailContainer}>
            <Text style={styles.priceText}>{getTotalAmount()} JD</Text>
            <Text style={styles.priceText}>المبلغ الإجمالي</Text>
          </View>
        </View>
      </ScrollView>
      <Button
        onPress={() => onSubmit()}
        loading={isLoading}
        type="clear"
        title="تأكيد"
        useForeground
        titleStyle={{color: '#fff', fontFamily: fonts.bold}}
        containerStyle={[
          styles.submitButtonStyle,
          {
            backgroundColor: colors.primaryColor,
            marginHorizontal: wp(5),
            marginBottom: 20,
          },
        ]}
      />
      <AccountModal visible={visible} toggleOverlay={toggleOverlay} />
      <AlertMessage
        visible={visibleValidationAlert}
        message={validationMessage}
        buttonText="تم"
        buttonAction={() => {
          clearCoupon();
          setVisibleValidationAlert(false);
        }}
      />
      <AlertMessage
        visible={visibleAlert}
        message={'تم تأكيد طلبك بنجاح'}
        buttonText="طلباتي"
        buttonText2="الرئيسية"
        buttonAction={() =>
          clearBeforeNavigation([
            {name: Pages.Home.route},
            {name: Pages.Order.route},
          ])
        }
        buttonAction2={() => clearBeforeNavigation([{name: Pages.Home.route}])}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 10,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: colors.primaryColor,
  },
  buttonActiveStyle: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: colors.primaryColor,
    borderWidth: 1,
  },
  buttonTitleStyle: {color: colors.primaryColor, fontFamily: fonts.bold},
  buttonActiveTitleStyle: {color: '#FFF'},
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: hp(1),
  },
  activeAddressContainer: {
    backgroundColor: '#EFE7EB',
  },
  textContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  textAddress: {fontSize: wp(3), fontFamily: fonts.regular},
  commentBox: {
    padding: wp(1),
    height: hp(10),
    margin: hp(1),
    backgroundColor: '#F7F7F7',
    fontSize: hp(2),
    borderRadius: 10,
    fontFamily: fonts.regular,
  },
  coupone: {
    flex: 1,
    padding: hp(0.8),
    margin: hp(1),
    backgroundColor: '#F7F7F7',
    fontSize: wp(3),
    borderRadius: 10,
    fontFamily: fonts.regular,
  },
  paymentButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(1),
  },
  activePaymentButton: {backgroundColor: colors.primaryColor, borderRadius: 10},
  paymentText: {fontFamily: fonts.medium, color: '#000', fontSize: wp(3)},
  regularText: {
    fontFamily: fonts.regular,
    color: '#000',
    fontSize: wp(4),
  },
  priceText: {
    fontFamily: fonts.bold,
    color: '#000',
    fontSize: wp(4),
  },
  subTitle: {
    textAlign: 'right',
    fontFamily: fonts.bold,
    color: '#000',
    fontSize: wp(4.2),
  },
  textDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  submitButtonStyle: {
    // paddingVertical: hp(1.2),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: colors.primaryColor,
  },
  overlayStyle: {
    flex: 1,
    marginTop: hp(10),
    width: wp(100),
    justifyContent: 'flex-start',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});
const mapStateToProps = state => {
  return {
    cartReducer: state.cartReducer,
    cartWholesaleReducer: state.cartWholesaleReducer,
    checkoutReducer: state.checkoutReducer,
    authReducer: state.authReducer,
    homeReducer: state.homeReducer,
  };
};

export default connect(mapStateToProps, {
  submitOrder,
  updateCheckoutDetails,
  getCheckoutInfo,
  getCouponByCode,
  clearCheckout,
  clearCart,
  clearCoupon,
})(CheckoutScreen);
