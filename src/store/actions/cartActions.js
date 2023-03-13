import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  DELETE_PRODUCT_FROM_CART,
  CLEAR_CART,
  ADD_TO_CART_WHOLESALE,
  REMOVE_FROM_CART_WHOLESALE,
  DELETE_PRODUCT_FROM_CART_WHOLESALE,
  CLEAR_CART_WHOLESALE,
} from './types';

export const addToCart = (data, isWholeSale) => dispatch => {
  dispatch({
    type: isWholeSale ? ADD_TO_CART_WHOLESALE : ADD_TO_CART,
    payload: data,
  });
};

export const removeFromCart = (data, isWholeSale) => dispatch => {
  dispatch({
    type: isWholeSale ? REMOVE_FROM_CART_WHOLESALE : REMOVE_FROM_CART,
    payload: data,
  });
};
export const deleteProductFromCart = (data, isWholeSale) => dispatch => {
  dispatch({
    type: isWholeSale
      ? DELETE_PRODUCT_FROM_CART_WHOLESALE
      : DELETE_PRODUCT_FROM_CART,
    payload: data,
  });
};

export const clearCart = isWholeSale => dispatch => {
  dispatch({
    type: isWholeSale ? CLEAR_CART_WHOLESALE : CLEAR_CART,
  });
};
