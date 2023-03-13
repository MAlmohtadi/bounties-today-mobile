import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  I18nManager,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import WholesaleIcon from '_icons/wholesale';
import DiscountIcon from '_icons/discount';
import CartIcon from '_icons/cart';
import Pages from '../../navigations/Pages';
import { connect } from 'react-redux';
import { updateWholeSale } from '_actions/homeActions';
import { clearCart } from '_actions/cartActions';
import { useNavigation } from '@react-navigation/native';
import AlertMessage from '_organisms/AlertMessage';
import Grocery from '_icons/grocery';
import CheckList from '_icons/checklist';
import HomeIcon from '_icons/home';
import fonts from '_utils/constants/Fonts';
import colors from '_utils/constants/Colors';

const BottomMenu = ({
  homeReducer: {
    isWholeSale,
    adminSettingsResponse: { wholeSaleEnabled,offersEnabled },
  },
  cartReducer,
  cartWholesaleReducer,
  authReducer: { id: userId },
  navigationReducer: { routeName },
  updateWholeSale,
}) => {
  const { products = [] } = isWholeSale ? cartWholesaleReducer : cartReducer;
  const navigation = useNavigation();
  const [visibleAlert, setVisibleAlert] = useState(false);

  const changeSaleFlag = () => {
    navigation.reset({ index: 0, routes: [{ name: Pages.SplashScreen.route }] });

    updateWholeSale(!isWholeSale);

  };
  return (!Pages[`${routeName}`].bottomMenueVisible ? null :
    <View style={styles.containerStyle}>
      <View style={styles.leftSubContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(Pages.Home.route);
          }}>
          <View style={styles.iconContainer}>
            <HomeIcon width={wp(8)} height={hp(3)} fill={routeName.toLowerCase().includes('home')
                ? colors.secondryColor
                : '#FFF'} />
            <Text
              style={[
                styles.iconTitle,
                routeName === Pages.Home.route ? styles.activeIcon : null,
              ]}>
              {Pages.Home.title}
            </Text>
          </View>
        </TouchableOpacity>
       {offersEnabled&& <TouchableOpacity
          onPress={() => navigation.navigate(Pages.Offer.route)}>
          <View style={styles.iconContainer}>
            <DiscountIcon width={wp(8)} height={hp(3)} fill={routeName === Pages.Offer.route ? colors.secondryColor: '#ffff'}/>
            <Text
              style={[
                styles.iconTitle,
                routeName === Pages.Offer.route ? styles.activeIcon : null,
              ]}>
              {Pages.Offer.title}
            </Text>
          </View>
        </TouchableOpacity>}
      </View>
      <View style={styles.middleSubContainer}>
        <View style={styles.halfCircleContainer}>
          <View style={{ height: wp(15), backgroundColor: 'transparent' }} />
          <View style={{ height: wp(15), backgroundColor: '#F7F7F7' }} />
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate(Pages.Cart.route)}>
          <CartIcon width={wp(8)} height={hp(4)} fill={colors.secondryColor} />
          {products.length > 0 && (
            <View style={styles.cartCounterContainer}>
              <Text style={styles.cartCounter}>{products.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate(Pages.Category.route)}>
          <View style={styles.iconContainer}>
            <Grocery width={wp(8)} height={hp(3)} fill={routeName === Pages.Category.route ? colors.secondryColor : '#ffff'} />
            <Text
              style={[
                styles.iconTitle,
                routeName === Pages.Category.route
                  ? styles.activeIcon
                  : null,
              ]}>
              {Pages.Category.title}
            </Text>
          </View>
        </TouchableOpacity>
        {wholeSaleEnabled != false ? (
          <TouchableOpacity
            onPress={() => {
              changeSaleFlag();
            }}>
            <View style={styles.iconContainer}>
              <WholesaleIcon width={wp(8)} height={hp(3)} fill={colors.secondryColor} />
              <Text style={[styles.iconTitle]}>
                {isWholeSale ? 'البيع بالتجزئة' : 'البيع بالجملة'}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (!userId) {
                setVisibleAlert(true);
              } else {
                navigation.navigate(Pages.Order.route);
              }
            }}>
            <View style={[styles.iconContainer]}>
              <CheckList width={wp(8)} height={hp(3)} fill={routeName.toLowerCase().includes('order')
                ? colors.secondryColor
                : '#FFF'} />
              <Text
                style={[
                  styles.iconTitle,
                  routeName.toLowerCase().includes('order')
                    ? styles.activeIcon
                    : null,
                ]}>
                {Pages.Order.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <AlertMessage
        visible={visibleAlert}
        message={'يجب عليك تسجيل الدخول'}
        buttonText="تم"
        buttonAction={() => {
          setVisibleAlert(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: wp(100),
    aspectRatio: Platform.isPad ? 6 / 1 : 5 / 1,
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    backgroundColor: colors.primaryColor,
    shadowColor: '#00000040',
    shadowOffset: {
      width: -2,
      height: -2,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 15,
  },
  middleSubContainer: {
    flex: 3,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftSubContainer: {
    flex: 4,
    flexDirection: !I18nManager.isRTL ? 'row-reverse' : 'row',
    position: 'relative',
    justifyContent: 'space-around',
  },
  rightContainer: {
    flex: 4,
    flexDirection: !I18nManager.isRTL ? 'row-reverse' : 'row',
    position: 'relative',
    justifyContent: 'space-around',
  },
  halfCircleContainer: {
    height: wp(30),
    width: '100%',
    aspectRatio: 1,
    borderRadius: wp(15),
    overflow: 'hidden',
    position: 'absolute',
    top: -wp(15),
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: wp(5),
  },
  iconTitle: {
    color: 'white',
    fontFamily: fonts.regular,
    fontSize: Platform.OS === 'ios' ? wp(3) : wp(3.5),
    marginVertical: 2,
  },
  activeIcon: {
    color: colors.secondryColor,
  },
  bullet: {
    color: colors.secondryColor,
    fontSize: wp(2.5),
  },
  cartButton: {
    position: 'absolute',
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(17),
    aspectRatio: 1,
    top: -wp(6),
    borderRadius: wp(15),
    shadowColor: '#00000040',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 2,
  },
  cartCounter: {
    fontSize: wp(3.4),
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.primaryColor,
  },
  cartCounterContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    top: 0,
    right: 4,
    borderColor: colors.primaryColor,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: wp(3),
    width: '30%',
  },
});
const mapStateToProps = (state) => {
  return {
    homeReducer: state.homeReducer,
    cartReducer: state.cartReducer,
    authReducer: state.authReducer,
    navigationReducer: state.navigationReducer,
    cartWholesaleReducer: state.cartWholesaleReducer,
  };
};

export default connect(mapStateToProps, {
  updateWholeSale,
  clearCart,

})(BottomMenu);