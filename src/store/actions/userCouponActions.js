import {SET_ALERT, GET_USER_COUPON} from './types';
import {api} from '../../config/Api';
import {END_POINTS, METHODS} from '_utils/services';

export const getUserCoupons = (data, showSuccessAlert) => dispatch => {
  api(END_POINTS.getUserCoupons, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: GET_USER_COUPON,
        payload: res.data,
      });
      if (showSuccessAlert) {
      }
    })
    .catch(err => {
      console.error(err);

      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};
