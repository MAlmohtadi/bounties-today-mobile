import {GET_LOYALTY_INFO, LOAD_LOYALTY_SCREEN, SET_ALERT} from './types';
import {api} from '../../config/Api';
import {END_POINTS, METHODS} from '_utils/services';

export const getLoyaltyInfo = (data, showSuccessAlert) => dispatch => {
  api(END_POINTS.getLoyaltyInfo, data, METHODS.POST)
    .then(res => {
      console.log('essss', {ddd: res.data});
      dispatch({
        type: GET_LOYALTY_INFO,
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

export const loadLoyaltyScreen = () => dispatch => {
  dispatch({
    type: LOAD_LOYALTY_SCREEN,
  });
};

export const showInvalidPointsAlert = () => dispatch => {
  dispatch({
    type: SET_ALERT,
    payload: {message: ' اقل عدد نقاط لطلب كوبون هو 1000 نقطة'},
  });
};

export const convertPointsToCoupon = data => dispatch => {
  api(END_POINTS.convertPointsToCoupon, data, METHODS.POST).then(() => {
    api(END_POINTS.getLoyaltyInfo, data, METHODS.POST)
      .then(res => {
        console.log('essss', {ddd: res.data});
        dispatch({
          type: GET_LOYALTY_INFO,
          payload: res.data,
        });
        dispatch({
          type: SET_ALERT,
          payload: {
            message:
              ' تم طلب كوبون, سيتم اصدار الكوبون خلال يومان يرجى متابعة شاشه الكوبونات',
          },
        });
      })
      .catch(err => {
        console.error(err);

        dispatch({
          type: SET_ALERT,
          payload: {...err},
        });
      })
      .catch(err => {
        console.error(err);

        dispatch({
          type: SET_ALERT,
          payload: {...err},
        });
      });
  });
};
