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

const calcuateRemoveQuantity = (quantities,product) => {
  if (product.counterStartValue && product.countStepValue) {
    return quantities[product.id] &&
    quantities[product.id] - product.countStepValue >=
      product.counterStartValue
      ? quantities[product.id] - product.countStepValue 
      : 0 ;
  } else {
    return quantities[product.id]
      ? quantities[product.id] - 1
      : 0;
  }
};

const calcuateAddQuantity = (quantities, product) => {
  if (product.counterStartValue && product.countStepValue) {
   return quantities[product.id]
      ? quantities[product.id] + product.countStepValue
      : product.counterStartValue ;
  } else {
    return quantities[product.id] ? quantities[product.id] + 1 : 1;
  }
};

export default (state = initialState, action) => {
  let quantity;
  let productsUpdated = state.products;
  switch (action.type) {
    case ADD_TO_CART_WHOLESALE:
      quantity =  calcuateAddQuantity(state.quantities, action.payload);
      quantity === 1 && productsUpdated.push(action.payload);
      return {
        ...state,
        products: [...productsUpdated],
        totalPrice: state.totalPrice + action.payload.price,
        quantities: {...state.quantities, [`${action.payload.id}`]: quantity},
      };
    case REMOVE_FROM_CART_WHOLESALE:
      quantity = calcuateRemoveQuantity(state.quantities, action.payload);
      quantity === 0 &&
        (productsUpdated = state.products.filter(
          product => product.id !== action.payload.id,
        ));
      return {
        ...state,
        products: [...productsUpdated],
        totalPrice: state.totalPrice - action.payload.price,
        quantities: {...state.quantities, [`${action.payload.id}`]: quantity},
      };
    case DELETE_PRODUCT_FROM_CART_WHOLESALE:
      productsUpdated = state.products.filter(
        product => product.id !== action.payload.id,
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
