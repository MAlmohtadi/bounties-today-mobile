import React, { Fragment, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import EmptyIconWithDescription from '_organisms/EmptyIconWithDescription';
import { addToCart, removeFromCart } from '_actions/cartActions';
import {
  clearFavorite,
  removeFromFavorite,
  getFavoriteProducts,
  clearFavoriteScreen,
} from '_actions/favoriteActions';
import HeartIcon from '_icons/Heart';
import TrushIcon from '_icons/trush.svg';
import Card from '_organisms/Card';
import AlertMessage from '_organisms/AlertMessage';
import Pages from '../navigations/Pages';
import LoadingSpinner from '_organisms/LoadingSpinner';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const FavoriteScreen = ({
  navigation,
  addToCart,
  removeFromCart,
  clearFavorite,
  clearFavoriteScreen,
  removeFromFavorite,
  getFavoriteProducts,
  homeReducer: { isWholeSale },
  authReducer: { id: userId },
  cartReducer,
  cartWholesaleReducer,
  favoriteReducer: { products = [], isUpdated, isLoading },
}) => {
  const [visibleAlert, setVisibleAlert] = useState(false);
  const { quantities = {} } = isWholeSale ? cartWholesaleReducer : cartReducer;

  useEffect(() => {
    const unsubscribe = [navigation.addListener('focus', () => {
      if (!userId) {
        setVisibleAlert(true);
      } else {
        getFavoriteProducts({ userId, isWholeSale });
      }
    }), navigation.addListener('blur', () => {
      clearFavoriteScreen();
    })];

    return () => {
      unsubscribe.forEach(unSub => {
        unSub();
      })
    };
  }, [
    isUpdated,
    isWholeSale,
    navigation,
    userId,
    isLoading
  ]);
  return isLoading && userId ? (<LoadingSpinner />) : (
    <View style={styles.mainContainer}>
      <View style={{ flex: 1, margin: 10 }}>
        <Fragment>
          {products.length > 0 && <View style={styles.topContainer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => clearFavorite({ userId, isWholeSale })}>
              <TrushIcon
                width={wp(4)}
                style={{ marginRight: wp(2), aspectRatio: 1 }}
              />
              <Text style={styles.clearTitle}>حذف المفضلة</Text>
            </TouchableOpacity>
          </View>}
          <FlatList
            contentContainerStyle={{
              paddingTop: hp(1),
              alignItems: products.length == 0 ? 'center' : null,
              paddingBottom: hp(15),
              paddingHorizontal: 2,
            }}
            showsVerticalScrollIndicator={false}
            data={products}
            ListEmptyComponent={() => (<Fragment>
              <View />
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <EmptyIconWithDescription
                  iconComponent={<HeartIcon fill={colors.primaryColor} />}
                  description="سلة المفضلة فارغة !"
                />
              </View>
            </Fragment>)}
            onEndReachedThreshold={0.4}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item, index }) => (
              <Card
                key={item.id}
                product={item}
                quantity={quantities[`${item.id}`]}
                showTrushIcon
                onClickTrushIcon={(productId) =>
                  removeFromFavorite({ productId, userId, isWholeSale })
                }
                addToCart={(item) => addToCart(item, isWholeSale)}
                removeFromCart={(item) => removeFromCart(item, isWholeSale)}
              />
            )}
          />
          {/* <View style={{ height: hp(15) }} /> */}
        </Fragment>
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
});

const mapStateToProps = (state) => {
  return {
    cartReducer: state.cartReducer,
    cartWholesaleReducer: state.cartWholesaleReducer,
    favoriteReducer: state.favoriteReducer,
    authReducer: state.authReducer,
    homeReducer: state.homeReducer,
  };
};

export default connect(mapStateToProps, {
  addToCart,
  removeFromCart,
  clearFavorite,
  removeFromFavorite,
  getFavoriteProducts,
  clearFavoriteScreen,
})(FavoriteScreen);
