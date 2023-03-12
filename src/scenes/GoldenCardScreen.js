import React, {Fragment, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Dash from 'react-native-dash';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import appLogo from '../assets/images/small-logo.png';
import startLogo from '../assets/images/fleeting-star.png';
import BarCodeModal from '_organisms/BarcodeModal';
import {Button} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {
  getLoyaltyInfo,
  convertPointsToCoupon,
  loadLoyaltyScreen,
  showInvalidPointsAlert,
} from '_actions/goldenCardActions';
import AlertMessage from '_organisms/AlertMessage';
import Pages from '../navigations/Pages';
import LoadingSpinner from '_organisms/LoadingSpinner';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const GoldenCardScreen = ({
  navigation,
  getLoyaltyInfo,
  convertPointsToCoupon,
  loadLoyaltyScreen,
  showInvalidPointsAlert,
  authReducer: {id: userId},
  goldenCardReducer: {
    barcode = null,
    onlinePoints = 0,
    storePoints = 0,
    termsOfService = [],
    isGoldenCardLoading = true,
  },
}) => {
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  const toggleOverlay = () => {
    setShowBarcodeModal(!showBarcodeModal);
  };
  const convert = () => {
    if((onlinePoints + storePoints) < 1000) {
      showInvalidPointsAlert();
    } else {
      loadLoyaltyScreen();
      convertPointsToCoupon({id: userId});
    }
  };
  useEffect(() => {
    const unsubscribe = [
      navigation.addListener('focus', () => {
        if (!userId) {
          setVisibleAlert(true);
        } else {
          loadLoyaltyScreen();
          getLoyaltyInfo({id: userId});
        }
      }),
    ];

    return () => {
      unsubscribe.forEach(unSub => {
        unSub();
      });
    };
  }, [navigation, userId, isGoldenCardLoading]);
  return isGoldenCardLoading && userId ? (
    <LoadingSpinner />
  ) : (
    <View style={styles.mainContainer}>
      <View style={{flex: 1, margin: 10}}>
        <ScrollView keyboardShouldPersistTaps="handled" style={{flex: 1}}>
          <View>
            <Fragment>
              <View
                style={{
                  marginLeft: 15,
                  marginRight: 15,
                  backgroundColor: '#d4af37',
                  borderTopEndRadius: 15,
                  borderTopStartRadius: 15,
                  padding: 10,
                  shadowColor: '#d4af37',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.9,
                  shadowRadius: 15,
                  elevation: 1050,
                }}>
              
                <View style={styles.textDetailContainer}>
                  <Image style={[styles.maskImageStyle]} source={appLogo} />
                  <Text style={styles.regularText}>البطاقة الذهبية </Text>
                </View>
                <View style={styles.textDetailContainer}>
                  <Text style={styles.priceText}>{onlinePoints}</Text>
                  <Text style={styles.regularText}>نقاط التطبيق</Text>
                </View>
                <View style={styles.textDetailContainer}>
                  <Text style={styles.priceText}>{storePoints}</Text>
                  <Text style={styles.regularText}>نقاط الفروع</Text>
                </View>

                <View style={styles.textDetailContainer}>
                  <Text style={styles.priceText}>
                    {storePoints + onlinePoints}
                  </Text>
                  <Text style={styles.regularText}> مجموع النقاط</Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  marginLeft: 15,
                  marginRight: 15,
                  borderBottomEndRadius: 15,
                  borderBottomStartRadius: 15,
                  padding: 10,
                  shadowColor: '#d4af37',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.9,
                  shadowRadius: 15,
                  elevation: 10,
                }}>
                <View style={styles.textDetailContainer2}>
                  <TouchableOpacity
                    style={styles.paddingButtons}
                    onPress={() => setShowBarcodeModal(true)}>
                    <Barcode value={barcode} width={2.2} height={70} />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  margin: 15,
                  marginBottom: 5,
                  backgroundColor: colors.primaryColorBrighter,
                  borderRadius: 15,
                  padding: 10,
                }}>
                <View style={styles.textDetailContainer}>
                  <Text style={[styles.regularText2]}>سياسة الاستخدام:</Text>
                </View>
                <View style={styles.textDetailContainer}>
                <Text style={[styles.regularText3]}>
                  برنامج النقاط الذهبية من جبران
                   </Text>
                  </View>
                  {termsOfService.map((item) => (
                       <View style={styles.textDetailContainer}>
                       <Text style={[styles.regularText3, {color: '#FF0000'}]}>
                       {`\u2043 ` + item}
                       </Text>
                       </View>
                  ))
}
            
              </View>

              <Button
                onPress={() => {
                  convert();
                }}
                loading={isGoldenCardLoading}
                type="clear"
                title="طلب كوبون"
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

              <BarCodeModal
                visible={showBarcodeModal}
                toggleOverlay={toggleOverlay}
                value={barcode}
              />
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
    marginBottom: wp(20),
  },
  textDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    textAlign: 'right',
  },
  textDetailContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginVertical: 5,
    textAlign: 'right',
  },
  priceText: {
    fontFamily: fonts.bold,
    color: '#000',
    fontSize: wp(4),
    textAlign: 'right',
  },
  regularText: {
    fontFamily: fonts.regular,
    color: '#000',
    fontSize: wp(4.5),
    textAlign: 'right',
  },
  regularText2: {
    fontFamily: fonts.regular,
    color: '#000',
    fontSize: wp(5),
    width: '100%',
    textAlign: 'right',
  },
  regularText3: {
    fontFamily: fonts.regular,
    color: '#000',
    fontSize: wp(4),
    width: '100%',
    textAlign: 'right',
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
    paddingVertical: hp(1.2),
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
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: '#FF0000',
  },
  clearTitle: {
    fontFamily: fonts.medium,
    fontSize: wp(3.2),
    color: '#FF0000',
  },
  clearTitle2: {
    fontFamily: fonts.medium,
    fontSize: wp(3.2),
    color: '#FF0000',
    textAlign: 'right',
  },
  totalPriceContainer: {
    backgroundColor: '#DED6DA',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(2),
  },
  totalPrice: {
    fontFamily: fonts.bold,
    fontSize: wp(3.2),
  },
  bottomContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  maskImageStyle: {
    height: hp(4),
    width: hp(5),
  },
});

const mapStateToProps = state => {
  return {
    authReducer: state.authReducer,
    goldenCardReducer: state.goldenCardReducer,
  };
};

export default connect(mapStateToProps, {
  getLoyaltyInfo,
  loadLoyaltyScreen,
  convertPointsToCoupon,
  showInvalidPointsAlert,
})(GoldenCardScreen);
