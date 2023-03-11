import {
  OFFER_LOADING,
  PRODUCT_LOADING,
  SET_ACTIVE_VIEW,
  SET_SORT_TYPE,
} from './types';

export const setActiveView = (viewType) => (dispatch) => {
  dispatch({
    type: SET_ACTIVE_VIEW,
    payload: viewType,
  });
};
export const setSortTypeConfig = (viewType) => (dispatch) => {
  dispatch({
    type: SET_SORT_TYPE,
    payload: viewType,
  });
  dispatch({
    type: OFFER_LOADING,
    payload: true,
  });
  dispatch({
    type: PRODUCT_LOADING,
    payload: true,
  });
};
