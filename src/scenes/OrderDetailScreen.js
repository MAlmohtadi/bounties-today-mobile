import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import OrderCard from '_organisms/OrderCard';
import {
  cancelOrder,
  getUserOrders,
  clearOrdersProducts,
  getOrderProducts,
} from '_actions/orderActions';
import {FlatList, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Card from '_organisms/Card';
import LoadingSpinner from '_organisms/LoadingSpinner';

const OrderDetailScreen = ({
  navigation,
  orderReducer: {
    order: {
      orderId,
      products: [],
      orderedProducts = [],
      isOrderProductLoading,
      cancelledDate,
      deliveryDate,
      isCancelled,
      orderDate,
      statusId,
      totalPrice,
    },
  },
  authReducer: {id: userId},
  cancelOrder,
  clearOrdersProducts,
  getOrderProducts,
}) => {
  const route = useRoute();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      clearOrdersProducts();
    });
    if (orderId && isOrderProductLoading) {
      getOrderProducts({
        orderId,
        userId,
      });
    }
    return unsubscribe;
  }, [
    navigation,
    orderId,
    isOrderProductLoading,
    userId,
  ]);
  return isOrderProductLoading ? (
    <LoadingSpinner />
  ) : (
    <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
      <OrderCard
        onCancel={cancelOrder}
        editable={false}
        order={{
          id: orderId,
          cancelledDate,
          deliveryDate,
          isCancelled,
          orderDate,
          statusId,
          totalPrice,
        }}
        onPressCancel={() => {}}
        onPressView={() => {}}
      />
      <FlatList
        style={{
          flex: 1,
          marginTop: 5,
          paddingHorizontal: 10,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{paddingBottom: hp(15)}]}
        data={orderedProducts}
        onEndReachedThreshold={0.4}
        keyExtractor={(item)=>`${item.id}`}
        renderItem={({item, index}) => (
          <Card
            key={`card-${item.id}`}
            product={item}
            quantity={item.quantity}
            showFavoriteIcon={false}
            showStockStatus={false}
            isEditable={false}
          />
        )}
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
  clearOrdersProducts,
  getUserOrders,
  getOrderProducts,
})(OrderDetailScreen);
