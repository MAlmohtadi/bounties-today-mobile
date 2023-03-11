import {
  APP_HAS_LOADED,
  FETCH_DATA_HOME_SCREEN,
  SET_ALERT,
  SET_SELECTED_CATEGORY,
  UPDATE_WHOLE_SALE,
} from './types';
import {api} from '../../config/Api';
import {END_POINTS, METHODS} from '_utils/services';

export const getHomeInfo = (isWholeSale) => (dispatch) => {
  api(END_POINTS.getHomeInfo + isWholeSale, null, METHODS.GET)
    .then((res) => {
      dispatch({
        type: FETCH_DATA_HOME_SCREEN,
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
export const updateWholeSale = (flag) => (dispatch) => {
  dispatch({
    type: UPDATE_WHOLE_SALE,
    payload: flag,
  });
};
export const setSelectedCategory = (data) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_CATEGORY,
    payload: data,
  });
};
export const appHasLoadedUpdate = (flag) => (dispatch) => {
  dispatch({
    type: APP_HAS_LOADED,
    payload: flag,
  });
};
