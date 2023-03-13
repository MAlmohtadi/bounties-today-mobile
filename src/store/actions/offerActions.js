import {
  GET_OFFER_PRODUCTS,
  GET_MORE_OFFER_PRODUCTS,
  OFFER_LOADING,
  CLEAR_OFFER,
  SET_ALERT,
} from './types';
import {api} from '../../config/Api';
import {END_POINTS, METHODS} from '_utils/services';
export const getOfferProducts = data => dispatch => {
  dispatch({
    type: OFFER_LOADING,
    payload: true,
  });
  api(END_POINTS.getOfferProdcuts, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: GET_OFFER_PRODUCTS,
        payload: res.data,
      });
      dispatch({
        type: OFFER_LOADING,
        payload: false,
      });
    })
    .catch(err => {
      console.log(err);

      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
      dispatch({
        type: OFFER_LOADING,
        payload: false,
      });
    });
};

export const loadMoreOfferProducts = data => dispatch => {
  api(END_POINTS.getOfferProdcuts, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: GET_MORE_OFFER_PRODUCTS,
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
export const clearOffer = () => dispatch => {
  dispatch({
    type: CLEAR_OFFER,
  });
};
