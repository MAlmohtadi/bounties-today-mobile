import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Divider, Icon } from 'react-native-elements';
import Pages from '../../navigations/Pages';
import { connect } from 'react-redux';
import { logoutUser } from '_actions/authActions';
import CheckList from '_icons/checklist';
import FavoriteIcon from '_icons/favorite.svg';
import LoyaltyIcon from '_icons/loyalty-card.svg';
import CouponIcon from '_icons/coupon.svg';
import UserIcon from '_icons/user';
import HomeIcon from '_icons/home';
import CustomerServiceIcon from '_icons/customer-service';
import LogoutIcon from '_icons/logout';
import fonts from '_utils/constants/Fonts';
import colors from '_utils/constants/Colors';

const DrawerMenu = ({
  navigation,
  authReducer: { id, name, phone },
  homeReducer: {
    isWholeSale,
    adminSettingsResponse: { goldenEnabled },
  },
  logoutUser,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Icon
          type="ionicon"
          name="grid"
          size={wp(7)}
          iconStyle={styles.iconStyle}
          onPress={() => navigation.toggleDrawer()}
          color={colors.primaryColor}
        />
      </View>
      <Divider style={styles.deviderStyle} />
      {id && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.textStyle}>{name}</Text>
          <Text style={styles.textStyle}>{phone}</Text>
          <Divider
            style={[
              styles.deviderStyle,
              {
                width: wp(40),
              },
            ]}
          />
        </View>
      )}
      <TouchableOpacity
        style={styles.lableAndTextContainer}
        onPress={() => navigation.navigate(Pages.Account.route)}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>حسابي</Text>
        </View>
        <UserIcon width={wp(6)} height={hp(3)} fill={colors.primaryColor} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.lableAndTextContainer}
        onPress={() => navigation.navigate(Pages.Home.route)}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>الرئيسية</Text>
        </View>
        <HomeIcon width={wp(6)} height={hp(3)} fill={colors.primaryColor} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.lableAndTextContainer}
        onPress={() => navigation.navigate(Pages.Favorite.route)}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>المفضلة</Text>
        </View>
        <FavoriteIcon width={wp(6)} height={hp(3)} fill={colors.primaryColor} />
      </TouchableOpacity>
      {goldenEnabled&&<TouchableOpacity
        style={styles.lableAndTextContainer}
        onPress={() => navigation.navigate(Pages.GoldenCard.route)}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>البطاقة الذهبية</Text>
        </View>
        <LoyaltyIcon width={wp(6)} height={hp(3)} fill={colors.primaryColor} />
      </TouchableOpacity>}
      <TouchableOpacity
        style={styles.lableAndTextContainer}
        onPress={() => navigation.navigate(Pages.UserCoupon.route)}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>الكوبونات </Text>
        </View>
        <CouponIcon width={wp(6)} height={hp(3)} fill={colors.primaryColor} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.lableAndTextContainer}
        onPress={() => navigation.navigate(Pages.Order.route)}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>طلباتي</Text>
        </View>
        <CheckList width={wp(6)} height={hp(3)} fill={colors.primaryColor} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.lableAndTextContainer}
        onPress={() => navigation.navigate(Pages.CustomerService.route)}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>خدمة العملاء</Text>
        </View>
        <CustomerServiceIcon width={wp(6)} height={hp(3)} fill={colors.primaryColor} />

      </TouchableOpacity>
      {id && (
        <TouchableOpacity
          style={styles.lableAndTextContainer}
          onPress={() => logoutUser()}>
          <View style={styles.textContainer}>
            <Text style={styles.textStyle}>تسجيل خروج</Text>
          </View>
          <LogoutIcon width={wp(6)} height={hp(3)} fill={colors.primaryColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    marginTop: hp(6),
    alignItems:I18nManager.isRTL ? 'flex-start':'flex-end',
  },
  lableAndTextContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: hp(2),
  },
  iconStyle: { marginHorizontal: 5, aspectRatio: 1 },
  textContainer: { flex: 1, alignItems:I18nManager.isRTL ? 'flex-start':'flex-end', justifyContent: 'center', marginHorizontal: 10 },
  textStyle: { fontFamily: fonts.bold, color: colors.primaryColor, fontSize: hp(2) },
  deviderStyle: {
    backgroundColor: colors.primaryColor,
    height: 1.5,
    marginTop: 8,
    marginBottom: 15,
  },
  userInfoContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const mapStateToProps = (state) => {
  return {
    authReducer: state.authReducer,
    homeReducer: state.homeReducer,
  };
};

export default connect(mapStateToProps, { logoutUser })(DrawerMenu);
