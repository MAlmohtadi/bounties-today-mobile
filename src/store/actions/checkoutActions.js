import {
  SUBMIT_ORDER,
  UPDATE_CHECKOUT_DETAILS,
  GET_CHECKOUT_INFO,
  GET_COUPON_BY_CODE,
  CLEAR_CHECKOUT,
  SET_ALERT,
  CLEAR_COUPON,
  GET_DELIVERY_INFO,
} from './types';
import {api} from '../../config/Api';
import {END_POINTS, METHODS} from '_utils/services';

export const submitOrder = data => dispatch => {
  api(END_POINTS.addOrder, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: SUBMIT_ORDER,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};

export const updateCheckoutDetails = data => {
  return {
    type: UPDATE_CHECKOUT_DETAILS,
    payload: data,
  };
};
export const getCheckoutInfo = () => dispatch => {
  api(END_POINTS.getCheckoutInfo, null, METHODS.GET)
    .then(res => {
      dispatch({
        type: GET_CHECKOUT_INFO,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};
export const getDeliveryInfo = data => dispatch => {
  api(END_POINTS.getDeliveryInfo, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: GET_DELIVERY_INFO,
        payload: res.data,
      });
      dispatch({
        type: UPDATE_CHECKOUT_DETAILS,
        payload: {location: data.lat + ',' + data.lng},
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};
export const clearCoupon = () => dispatch => {
  dispatch({
    type: CLEAR_COUPON,
  });
};

export const getCouponByCode = data => dispatch => {
  api(END_POINTS.getCouponByCode, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: GET_COUPON_BY_CODE,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};

export const clearCheckout = () => dispatch => {
  dispatch({
    type: CLEAR_CHECKOUT,
  });
};
