import {
  CANCEL_ORDER,
  GET_ORDER_PRODUCTS,
  CONFIRM_UPDATE_ORDER_PRODUCTS,
  GET_USER_ORDERS,
  REMOVE_PRODUCT,
  ADD_ITEM_PRODUCT,
  REMOVE_ITEM_PRODUCT,
  CLEAR_ORDERS,
  SET_SELECTED_ORDER,
  SET_ALERT,
  CLEAR_ORDER_PRODUCTS,
} from './types';
import {api} from '../../config/Api';
import {END_POINTS, METHODS} from '_utils/services';
export const cancelOrder = (data) => (dispatch) => {
  api(END_POINTS.cancelOrder, data, METHODS.POST)
    .then((res) => {
      dispatch({
        type: CANCEL_ORDER,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};
export const confirmUpdateOrderProducts = (data) => (dispatch) => {
  api(END_POINTS.updateOrderProducts, data, METHODS.POST)
    .then((res) => {
      dispatch({
        type: CONFIRM_UPDATE_ORDER_PRODUCTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};

export const addItemProduct = (id) => (dispatch) => {
  dispatch({
    type: ADD_ITEM_PRODUCT,
    payload: {id},
  });
};
export const removeItemProduct = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_ITEM_PRODUCT,
    payload: {id},
  });
};
export const removeProduct = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_PRODUCT,
    payload: {id},
  });
};

export const getOrderProducts = (data) => (dispatch) => {
  api(END_POINTS.getOrderProducts, data, METHODS.POST)
    .then((res) => {
      dispatch({
        type: GET_ORDER_PRODUCTS,
        payload: {products: res.data, ...data},
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};

export const getUserOrders = (data) => (dispatch) => {
  api(END_POINTS.getUserOrders, data, METHODS.POST)
    .then((res) => {
      dispatch({
        type: GET_USER_ORDERS,
        payload: {orders: [...res.data], type: data.type},
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};

export const clearOrders = () => (dispatch) => {
  dispatch({
    type: CLEAR_ORDERS,
  });
};
export const clearOrdersProducts = () => (dispatch) => {
  dispatch({
    type: CLEAR_ORDER_PRODUCTS,
  });
};

export const setSelectedOrder = (data) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_ORDER,
    payload: data,
  });
};
