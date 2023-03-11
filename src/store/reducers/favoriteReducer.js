import {
  ADD_TO_FAVORITE,
  CLEAR_FAVORITE,
  REMOVE_FROM_FAVORITE,
  GET_FAVORITE_PRODUCTS,
  TOGGLE_FAVORITE_FLAG,
  FAVORITE_UNSUBSCRIBE,
} from '_actions/types';

const initialState = {
  products: [],
  isUpdated: false,
  isLoading: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_FAVORITE:
      return { ...state, isUpdated: true };
    case REMOVE_FROM_FAVORITE:
      return { ...state, products: [...state.products.filter(({ id }) => id !== action.payload.productId)], isUpdated: true };
    case CLEAR_FAVORITE:
      return { ...state, products: [], isUpdated: false };
    case TOGGLE_FAVORITE_FLAG:
      return { ...state, isUpdated: !state.isUpdated };
    case GET_FAVORITE_PRODUCTS:
      return { ...state, products: [...action.payload], isUpdated: false, isLoading: false };
    case FAVORITE_UNSUBSCRIBE:
      return { ...initialState };
    default:
      return state;
  }
};
