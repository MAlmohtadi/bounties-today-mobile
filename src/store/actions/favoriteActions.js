import {
  ADD_TO_FAVORITE,
  CLEAR_FAVORITE,
  REMOVE_FROM_FAVORITE,
  GET_FAVORITE_PRODUCTS,
  TOGGLE_FAVORITE_FLAG,
  SET_ALERT,
  FAVORITE_UNSUBSCRIBE,
} from './types';
import {api} from '../../config/Api';
import {END_POINTS, METHODS} from '_utils/services';
export const addToFavorite = data => dispatch => {
  api(END_POINTS.addFavorite, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: ADD_TO_FAVORITE,
        payload: data,
      });
    })
    .catch(err => {
      console.error(err);

      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};

export const removeFromFavorite = data => dispatch => {
  api(END_POINTS.deleteFavorite, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: REMOVE_FROM_FAVORITE,
        payload: data,
      });
    })
    .catch(err => {
      console.error(err);

      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};

export const clearFavorite = data => dispatch => {
  api(END_POINTS.deleteAllFavorite, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: CLEAR_FAVORITE,
        payload: data,
      });
    })
    .catch(err => {
      console.error(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};

export const getFavoriteProducts = data => dispatch => {
  api(END_POINTS.getFavoriteProducts, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: GET_FAVORITE_PRODUCTS,
        payload: res.data,
      });
    })
    .catch(err => {
      console.error(err);

      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};
export const toggleFavoriteFlag = () => dispatch => {
  dispatch({
    type: TOGGLE_FAVORITE_FLAG,
  });
};

export const clearFavoriteScreen = () => dispatch => {
  dispatch({
    type: FAVORITE_UNSUBSCRIBE,
  });
};
