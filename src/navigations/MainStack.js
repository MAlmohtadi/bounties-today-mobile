import React from 'react';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Home from '_scenes/Home';
import ProductScreen from '_scenes/ProductScreen';
import CartScreen from '_scenes/CartScreen';
import FavoriteScreen from '_scenes/FavoriteScreen';
import GoldenCardScreen from '_scenes/GoldenCardScreen';
import UserCouponScreen from '_scenes/UserCouponScreen';
import OffersScreen from '_scenes/OffersScreen';
import CheckoutScreen from '_scenes/CheckoutScreen';
import MapScreen from '_scenes/MapScreen';
import AccountScreen from '_scenes/AccountScreen';
import CustomerServiceScreen from '_scenes/CustomerServiceScreen';
import {Icon} from 'react-native-elements';
import Pages from './Pages';
import OrderTabs from './OrderTabs';
import OrderDetailScreen from '_scenes/OrderDetailScreen';
import EditOrderScreen from '_scenes/EditOrderScreen';
import HeaderSearch from '_organisms/HeaderSearch';
import SplashScreen from '_scenes/SplashScreen';
import CategoryScreen from '_scenes/CategoryScreen';
import {Fragment} from 'react';
import BottomMenu from '_organisms/BottomMenu';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const Stack = createStackNavigator();

const MainStack = ({navigation, route}) => {
  return (
    <Fragment>
      <Stack.Navigator
        initialRouteName={Pages.Home.route}
        screenOptions={{
          animationEnabled: true,
          headerMode:"screen",
          animationTypeForReplace: 'pop',
          cardStyle: {backgroundColor: '#fff'},
        }}>
        <Stack.Screen
          name={Pages.Home.route}
          component={Home}
          options={{header: (props) => <HeaderSearch {...props} />}}
        />
        <Stack.Screen
          name={Pages.Product.route}
          component={ProductScreen}
          options={{header: (props) => <HeaderSearch {...props} />}}
        />
        <Stack.Screen
          name={Pages.Cart.route}
          component={CartScreen}
          options={({navigation, route}) =>
            options({navigation, route, headerTitle: Pages.Cart.title})
          }
        />
        <Stack.Screen
          name={Pages.Favorite.route}
          component={FavoriteScreen}
          options={({navigation, route}) =>
            options({navigation, route, headerTitle: Pages.Favorite.title})
          }
        />

        <Stack.Screen
          name={Pages.GoldenCard.route}
          component={GoldenCardScreen}
          options={({navigation, route}) =>
            options({navigation, route, headerTitle: Pages.GoldenCard.title})
          }
        />
        <Stack.Screen
          name={Pages.UserCoupon.route}
          component={UserCouponScreen}
          options={({navigation, route}) =>
            options({navigation, route, headerTitle: Pages.UserCoupon.title})
          }
        />
        <Stack.Screen
          name={Pages.Offer.route}
          component={OffersScreen}
          options={({navigation, route}) =>
            options({navigation, route, headerTitle: Pages.Offer.title})
          }
        />
        <Stack.Screen
          name={Pages.Checkout.route}
          component={CheckoutScreen}
          options={({navigation, route}) =>
            options({navigation, route, headerTitle: Pages.Checkout.title})
          }
        />
        <Stack.Screen
          name={Pages.Map.route}
          component={MapScreen}
          options={({navigation, route}) =>
            options({navigation, route, headerTitle: Pages.Map.title})
          }
        />
        <Stack.Screen
          name={Pages.Account.route}
          component={AccountScreen}
          options={({navigation, route}) =>
            options({navigation, route, headerTitle: Pages.Account.title})
          }
        />
        <Stack.Screen
          name={Pages.SplashScreen.route}
          component={SplashScreen}
          options={{header: null, headerShown: false}}
        />
        <Stack.Screen
          name={Pages.Order.route}
          component={OrderTabs}
          options={({navigation, route}) =>
            options({navigation, route, headerTitle: Pages.Order.title})
          }
        />
        <Stack.Screen
          name={Pages.OrderDetail.route}
          component={OrderDetailScreen}
          options={({navigation, route}) =>
            options({navigation, route, headerTitle: Pages.OrderDetail.title})
          }
        />
        <Stack.Screen
          name={Pages.EditOrder.route}
          component={EditOrderScreen}
          options={({navigation, route}) =>
            options({navigation, route, headerTitle: Pages.EditOrder.title})
          }
        />

        <Stack.Screen
          name={Pages.CustomerService.route}
          component={CustomerServiceScreen}
          options={({navigation, route}) =>
            options({
              navigation,
              route,
              headerTitle: Pages.CustomerService.title,
            })
          }
        />
        <Stack.Screen
          name={Pages.Category.route}
          component={CategoryScreen}
          options={({navigation, route}) =>
            options({navigation, route, headerTitle: Pages.Category.title})
          }
        />
      </Stack.Navigator>
      <BottomMenu />
    </Fragment>
  );
};

const options = ({navigation, route, headerTitle, isMeneEnabled}) => ({
  headerTitle: headerTitle,
  headerLeft: null,
  headerRight: () => (
    <Icon
      type="ionicon"
      name="chevron-forward-outline"
      iconStyle={{paddingHorizontal: 15}}
      onPress={() => navigation.goBack()}
      color={colors.primaryColor}
    />
  ),
  headerTitleAlign: 'center',
  headerTitleStyle: {fontSize: 20, fontFamily: fonts.bold},
  headerStyle: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0.5,
    shadowColor: '#000',
  },
});
const styles = StyleSheet.create({
  headerSearchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    marginVertical: 0,
    width: wp(85),
  },
  inputContainerStyle: {
    backgroundColor: '#F7F7F7',
    borderRadius: 18,
    height: 36,
    alignItems: 'center',
  },
  iconStyle: {paddingHorizontal: 15},
});
export default MainStack;
