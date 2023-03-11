import {
  ADD_TO_CART_WHOLESALE,
  REMOVE_FROM_CART_WHOLESALE,
  DELETE_PRODUCT_FROM_CART_WHOLESALE,
  CLEAR_CART_WHOLESALE,
} from '_actions/types';

const initialState = {
  quantities: {},
  products: [],
  totalPrice: 0,
};

export default (state = initialState, action) => {
  let quantity;
  let productsUpdated = state.products;
  switch (action.type) {
    case ADD_TO_CART_WHOLESALE:
      quantity = state.quantities[action.payload.id]
        ? state.quantities[action.payload.id] + 1
        : 1;
      quantity === 1 && productsUpdated.push(action.payload);
      return {
        ...state,
        products: [...productsUpdated],
        totalPrice: state.totalPrice + action.payload.price,
        quantities: {...state.quantities, [`${action.payload.id}`]: quantity},
      };
    case REMOVE_FROM_CART_WHOLESALE:
      quantity = state.quantities[action.payload.id]
        ? state.quantities[action.payload.id] - 1
        : 0;
      quantity === 0 &&
        (productsUpdated = state.products.filter(
          (product) => product.id !== action.payload.id,
        ));
      return {
        ...state,
        products: [...productsUpdated],
        totalPrice: state.totalPrice - action.payload.price,
        quantities: {...state.quantities, [`${action.payload.id}`]: quantity},
      };
    case DELETE_PRODUCT_FROM_CART_WHOLESALE:
      productsUpdated = state.products.filter(
        (product) => product.id !== action.payload.id,
      );
      quantity = 0;
      return {
        ...state,
        products: [...productsUpdated],
        totalPrice: state.totalPrice - action.payload.price,
        quantities: {...state.quantities, [`${action.payload.id}`]: quantity},
      };
    case CLEAR_CART_WHOLESALE:
      return {
        ...state,
        ...initialState,
        products: [],
      };
    default:
      return state;
  }
};
