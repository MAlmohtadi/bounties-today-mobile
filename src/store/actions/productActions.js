import {
  GET_PRODUCTS,
  GET_MORE_PRODUCTS,
  GET_SEARCH_PRODUCTS,
  GET_MORE_SEARCH_PRODUCTS,
  UPDATE_SEARCH_CRITERIA,
  CLEAR_PRODUCT,
  PRODUCT_LOADING,
  SET_ALERT,
} from './types';
import {api} from '../../config/Api';
import {END_POINTS, METHODS} from '_utils/services';
export const getProducts = (data) => (dispatch) => {
  api(END_POINTS.getProducts, data, METHODS.POST)
    .then((res) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
      dispatch({
        type: PRODUCT_LOADING,
        payload: false,
      });
    });
};

export const loadMoreProducts = (data) => (dispatch) => {
  api(END_POINTS.getProducts, data, METHODS.POST)
    .then((res) => {
      dispatch({
        type: GET_MORE_PRODUCTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
      dispatch({
        type: PRODUCT_LOADING,
        payload: false,
      });
    });
};

export const getSearchProducts = (data) => (dispatch) => {
  api(END_POINTS.searchProducts, data, METHODS.POST)
    .then((res) => {
      dispatch({
        type: GET_SEARCH_PRODUCTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
      dispatch({
        type: PRODUCT_LOADING,
        payload: false,
      });
    });
};
export const loadMoreSearchProducts = (data) => (dispatch) => {
  api(END_POINTS.searchProducts, data, METHODS.POST)
    .then((res) => {
      dispatch({
        type: GET_MORE_SEARCH_PRODUCTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
      dispatch({
        type: PRODUCT_LOADING,
        payload: false,
      });
    });
};
export const updateSearchCriteria = (data) => (dispatch) => {
  dispatch({
    type: UPDATE_SEARCH_CRITERIA,
    payload: data,
  });
};

export const clearProduct = () => (dispatch) => {
  dispatch({
    type: CLEAR_PRODUCT,
  });
};
export const setLoadingProduct = () => (dispatch) => {
  dispatch({
    type: PRODUCT_LOADING,
    payload: true,
  });
};
