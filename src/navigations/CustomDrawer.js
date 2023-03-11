import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import MainStack from './MainStack';
import DrawerMenu from '_organisms/DrawerMenu';
import AlertMessage from '_organisms/AlertMessage';
import NoConnection from '_organisms/NoConnection';
import {connect} from 'react-redux';
import RNRestart from 'react-native-restart';
import {clearErrors} from '_actions/alertActions';
import {screenChange} from '_actions/navigationActions';
import RNBootSplash from 'react-native-bootsplash';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const Drawer = createDrawerNavigator();

const CustomDrawer = ({
  alertReducer: {error = {status: 0, message: '', isBussinessError: false}},
  clearErrors,
  screenChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigationRef = useRef();
  const routeNameRef = useRef();
  useEffect(() => {
    if (error != null && error.status != 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [error]);
  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
          RNBootSplash.hide({fade: true});
        }}
        onStateChange={() => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            // The line below uses the expo-firebase-analytics tracker
            // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
            // Change this line to use another Mobile analytics SDK
            screenChange({routeName: currentRouteName});
          }

          // Save the current route name for later comparison
          routeNameRef.current = currentRouteName;
        }}>
        <Drawer.Navigator
          screenOptions={{
            headerTintColor: 'blue',
            header: null,
            headerShown: false,
            gestureEnabled: true,
          }}
          // drawerType='front'
          drawerContent={(props) => <DrawerMenu {...props} />}
          drawerStyle={{width: widthPercentageToDP(50)}}
          drawerPosition="right">
          <Drawer.Screen name="MainScreen" component={MainStack} />
        </Drawer.Navigator>
      </NavigationContainer>
      <NoConnection />
      {isVisible && (
        <AlertMessage
          visible={isVisible}
          message={error && error.message ? error.message : 'نأسف، حدث خطأ'}
          buttonText={error && error.status != 0 ? 'تم' : 'إعادة المحاولة'}
          buttonAction={() => {
            error && error.status == 0 ? RNRestart.Restart() : clearErrors();
          }}
        />
      )}
    </SafeAreaProvider>
  );
};
const mapStateToProps = (state) => {
  return {
    alertReducer: state.alertReducer,
  };
};

export default connect(mapStateToProps, {clearErrors, screenChange})(
  CustomDrawer,
);
