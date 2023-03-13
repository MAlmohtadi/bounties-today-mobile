import {
  GET_USER_ORDERS,
  GET_ORDER_PRODUCTS,
  CONFIRM_UPDATE_ORDER_PRODUCTS,
  REMOVE_PRODUCT,
  ADD_ITEM_PRODUCT,
  REMOVE_ITEM_PRODUCT,
  CANCEL_ORDER,
  CLEAR_ORDERS,
  CLEAR_ORDER_PRODUCTS,
  SET_SELECTED_ORDER,
} from '_actions/types';

const initialState = {
  ordersByTypes: {
    AllOrder: [],
    CurrentOrder: [],
    PreviousOrder: [],
  },
  order: {
    products: [],
    orderedProducts: [],
    isUpdated: false,
    isOrderProductLoading: false,
  },
  isOrderLoading: true,
};

export default (state = initialState, action) => {
  let products;
  switch (action.type) {
    case GET_USER_ORDERS:
      return {
        ...state,
        ordersByTypes: {
          ...state.ordersByTypes,
          [`${action.payload.type}`]: [...action.payload.orders],
        },
        isOrderLoading: false,
      };
    case GET_ORDER_PRODUCTS:
      return {
        ...state,
        order: {
          ...state.order,
          ...action.payload,
          orderedProducts: [...action.payload.products],
          isUpdated: false,
          isOrderProductLoading: false,
        },
      };
    case SET_SELECTED_ORDER:
      return {
        ...state,
        order: {
          ...state.order,
          ...action.payload,
          isOrderProductLoading: true,
        },
      };
    case CONFIRM_UPDATE_ORDER_PRODUCTS:
      return {
        ...state,
        order: {
          ...state.order,
          products: [...action.payload],
          isUpdated: false,
        },
        isOrderLoading: true,
      };
    case REMOVE_PRODUCT:
      return {
        ...state,
        order: {
          ...state.order,
          orderedProducts: [
            ...state.order.orderedProducts.filter(
              item => item.id !== action.payload.id,
            ),
          ],

          isUpdated: true,
        },
      };
    case ADD_ITEM_PRODUCT:
      products = state.order.orderedProducts.map(item => {
        if (item.id === action.payload.id) {
          item.quantity = item.quantity + 1;
        }
        return item;
      });
      return {
        ...state,
        order: {
          ...state.order,
          orderedProducts: [...products],
          isUpdated: true,
        },
      };
    case REMOVE_ITEM_PRODUCT:
      products = state.order.orderedProducts.map(item => {
        if (item.id === action.payload.id) {
          item.quantity = item.quantity - 1;
        }
        return item;
      });
      return {
        ...state,
        order: {
          ...state.order,
          orderedProducts: [...products],
          isUpdated: true,
        },
      };
    case CLEAR_ORDERS:
      return {
        ...state,
        ordersByTypes: {
          AllOrder: [],
          CurrentOrder: [],
          PreviousOrder: [],
        },
        isOrderLoading: true,
      };
    case CLEAR_ORDER_PRODUCTS:
      return {
        ...state,
        order: {
          ...initialState.order,
          isOrderProductLoading: true,
        },
      };

    case CANCEL_ORDER:
      return {
        ...state,
        order: {
          ...state.order,
          ...action.payload,
          isOrderProductLoading: true,
        },
        isOrderLoading: true,
      };
    default:
      return state;
  }
};
