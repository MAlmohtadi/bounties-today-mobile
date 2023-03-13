import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Pages from './Pages';
import OrderScreen from '_scenes/OrderScreen';
import fonts from '_utils/constants/Fonts';
import colors from '_utils/constants/Colors';

const Tab = createMaterialTopTabNavigator();

const OrderTabs = ({navigation}) => {
  return (
    <Tab.Navigator
      initialRouteName={Pages.AllOrder.route}
      sceneContainerStyle={{backgroundColor: '#fff'}}
      tabBarOptions={{
        activeTintColor: colors.primaryColor,
        inactiveTintColor: '#8f8f8f',
        indicatorStyle: {
          borderBottomWidth: 4,
          borderColor: colors.primaryColor,
        },
        labelStyle: {fontFamily: fonts.bold},
      }}>
      <Tab.Screen
        name={Pages.PreviousOrder.route}
        component={OrderScreen}
        options={{tabBarLabel: Pages.PreviousOrder.title}}
      />
      <Tab.Screen
        name={Pages.CurrentOrder.route}
        component={OrderScreen}
        options={{tabBarLabel: Pages.CurrentOrder.title}}
      />
      <Tab.Screen
        name={Pages.AllOrder.route}
        component={OrderScreen}
        options={{tabBarLabel: Pages.AllOrder.title}}
      />
    </Tab.Navigator>
  );
};

export default OrderTabs;
