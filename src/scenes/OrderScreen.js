import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import OrderCard from '_organisms/OrderCard';
import {
  cancelOrder,
  getUserOrders,
  setSelectedOrder,
  clearOrders,
} from '_actions/orderActions';
import {FlatList, View, RefreshControl,Text} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Pages from '../navigations/Pages';
import AlertMessage from '_organisms/AlertMessage';
import LoadingSpinner from '_organisms/LoadingSpinner';

const pagesConfig = {
  AllOrder: {
    isCurrentOrders: false,
    isOlderOrders: false,
  },
  CurrentOrder: {
    isCurrentOrders: true,
    isOlderOrders: false,
  },
  PreviousOrder: {
    isCurrentOrders: false,
    isOlderOrders: true,
  },
};

const OrderScreen = ({
  navigation,
  route,
  orderReducer: {ordersByTypes, isOrderLoading},
  authReducer: {id: userId},
  homeReducer: {isWholeSale},
  cancelOrder,
  getUserOrders,
  setSelectedOrder,
  clearOrders,
}) => {
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [cancelVisibleAlert, setCancelVisibleAlert] = useState(false);
  const [cancelData,setCancelData] = useState(false);
  const fetchOrders = () => {
    getUserOrders({
      ...pagesConfig[route.name],
      isWholeSale,
      userId,
      type: route.name,
    });
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!userId && isOrderLoading && route.name === Pages.AllOrder.route) {
        setVisibleAlert(true);
      } else {
        clearOrders();
      }
    });

    if (userId && isOrderLoading) {
      fetchOrders();
    }

    return unsubscribe;
  }, [navigation, userId, isOrderLoading, route.name]);
  const renderEmpty = () => (
    <View style={{flex: 1, alignItems: 'center', margin: 20}}>
      <Text style={{fontFamily: 'Tajawal-Regular', color: '#61012D'}}>
        لا يوجد معلومات في {Pages[route.name].title}
      </Text>
    </View>
  );
  return (
    <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
      {isOrderLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {paddingBottom: hp(15), paddingHorizontal: 2},
          ]}
          ListEmptyComponent={renderEmpty()}
          data={isOrderLoading ? [] : ordersByTypes[`${route.name}`]}
          onEndReachedThreshold={0.4}
          initialNumToRender={5}
          refreshing={isOrderLoading}
          keyExtractor={(item)=>`${item.id}`}
          refreshControl={
            <RefreshControl
              refreshing={isOrderLoading}
              onRefresh={() => {
                fetchOrders();
              }}
            />
          }
          renderItem={({item, index}) => (
            <OrderCard
              order={item}
              editable={true}
              onPressCancel={() => {
                setCancelVisibleAlert(true);
                setCancelData({isWholeSale, orderId: item.id, userId});

              }}
              onPressView={() => {
                setSelectedOrder({orderId: item.id, ...item});
                navigation.navigate(
                  item.isCancelled || item.statusId !== 1
                    ? Pages.OrderDetail.route
                    : Pages.EditOrder.route,
                );
              }}
            />
          )}
        />
      )}
      <AlertMessage
        visible={cancelVisibleAlert}
        message={'هل انت متأكد من إلغاء الطلب'}
        buttonText="نعم"
        buttonText2="لا"
        buttonAction={() => {
          cancelOrder(cancelData);
          setCancelVisibleAlert(false);
        }}
        buttonAction2={() => {
          setCancelVisibleAlert(false);
        }}
      />
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
const mapStateToProps = (state) => {
  return {
    orderReducer: state.orderReducer,
    authReducer: state.authReducer,
    homeReducer: state.homeReducer,
  };
};
export default connect(mapStateToProps, {
  cancelOrder,
  getUserOrders,
  setSelectedOrder,
  clearOrders,
})(OrderScreen);
