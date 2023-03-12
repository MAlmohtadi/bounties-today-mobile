import React, { Fragment, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { addToCart, removeFromCart } from '_actions/cartActions';
import {
  clearFavorite,
  removeFromFavorite,
  getFavoriteProducts,
  clearFavoriteScreen,
} from '_actions/favoriteActions';
import {
  getLoyaltyInfo,
  convertPointsToCoupon,
  loadLoyaltyScreen
} from '_actions/goldenCardActions';
import {
  getUserCoupons,
} from '_actions/userCouponActions';
import AlertMessage from '_organisms/AlertMessage';
import Pages from '../navigations/Pages';
import LoadingSpinner from '_organisms/LoadingSpinner';
import fonts from '_utils/constants/Fonts';
import colors from '_utils/constants/Colors';

const UserCouponScreen = ({
  navigation,
  getUserCoupons,
  authReducer: { id: userId },
  userCouponReducer: {
    coupons = [],
    isUserCouponLoading = true
  }
}) => {
  const [visibleAlert, setVisibleAlert] = useState(false);

  useEffect(() => {
    const unsubscribe = [navigation.addListener('focus', () => {
      if (!userId) {
        setVisibleAlert(true);
      } else {
        getUserCoupons({ id: userId });
      }
    })];

    return () => {
      unsubscribe.forEach(unSub => {
        unSub();
      })
    };
  }, [
    navigation,
    userId,
    isUserCouponLoading
  ]);
  return isUserCouponLoading && userId ? (<LoadingSpinner />) : (
    <View style={styles.mainContainer}>
      <View style={{ flex: 1, margin: 10 }}>
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
      <View >
        <Fragment>
        
             {coupons.map((item) => (

<View style={styles.container}>
<View style={styles.rowStyle}>
  <View style={[styles.rowStyle, {justifyContent: 'flex-start'}]}>
    <Text style={styles.labelStyle}>تاريخ الاصدار : </Text>
    <Text style={styles.detailsTextStyle}>
      {item.issueDate}
    </Text>
  </View>
  <View style={[styles.rowStyle, {justifyContent: 'flex-start'}]}>
    <Text style={styles.labelStyle}>عدد النقاط: </Text>
    <Text style={styles.detailsTextStyle}>
      {item.onlinePoints + item.storePoints}
    </Text>
  </View>
  
</View>
<View style={styles.rowStyle}>

<View style={[styles.rowStyle, {justifyContent: 'flex-start'}]}>
    <Text style={styles.labelStyle}>القيمة  : </Text>
    <Text style={styles.labelStyle2}>
      {item.amount} دينار
    </Text>
  </View>
  <View style={[styles.rowStyle, {justifyContent: 'flex-start'}]}>
    <Text style={styles.labelStyle}>الحالة : </Text>
    <Text style={styles.detailsTextStyle}>
      {item.status}
    </Text>
  </View>
  
</View>
<View style={styles.rowStyle}>

<View style={[styles.rowStyle, {justifyContent: 'flex-start'}]}>
    <Text style={styles.labelStyle}>الكوبون  : </Text>
    <Text style={[styles.labelStyle2, styles.priceContainer]}>
      {item.code}
    </Text>
  </View>
</View>
</View>
            ))}
        </Fragment>
        </View>
        </ScrollView>
      </View>
      <AlertMessage
        visible={visibleAlert}
        message={'يجب عليك تسجيل الدخول'}
        buttonText="الرئيسية"
        buttonText2="تسجيل الدخول"
        buttonAction={() => {
          navigation.navigate(Pages.Home.route);
          setVisibleAlert(false);
        }}
        buttonAction2={() => {
          navigation.navigate(Pages.Account.route);
          setVisibleAlert(false);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: wp(20)
  },
  container: {
    backgroundColor: '#fff',
    margin: wp(2),
    justifyContent: 'flex-start',
    paddingVertical: wp(2),
    paddingHorizontal: hp(2),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.3,
    elevation: 4,
  },
  rowStyle: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  labelStyle: {
    textAlignVertical: 'center',
    fontFamily: fonts.bold,
    fontSize: wp(3.4),
    textAlign: 'right',
    
  }, 
  labelStyle2: {
    textAlignVertical: 'center',
    fontFamily: fonts.bold,
    fontSize: wp(4.2),
    paddingRight: 35,
    paddingLeft: 35,
    textAlign: 'right',
    marginRight:20
    
  },
  detailsTextStyle: {
    fontFamily: fonts.regular,
    fontSize: wp(3.6),
  },
  priceContainer: {
    backgroundColor: '#DED6DA',
    borderRadius: 10,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  buttonTitleStyle: {
    color: '#415F9B',
    fontSize: wp(3),
    fontFamily: fonts.bold,
  },
  buttonStyle: {
    backgroundColor: colors.primaryColor,
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: wp(2), marginHorizontal: wp(1)
  },
});

const mapStateToProps = (state) => {
  return {
    authReducer: state.authReducer,
    userCouponReducer: state.userCouponReducer
  };
};

export default connect(mapStateToProps, {
  getUserCoupons,
})(UserCouponScreen);
