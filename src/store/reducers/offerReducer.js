import {
  GET_OFFER_PRODUCTS,
  GET_MORE_OFFER_PRODUCTS,
  CLEAR_OFFER,
  OFFER_LOADING,
} from '_actions/types';

const initialState = {
  products: [],
  nextPageNumber: 0,
  productsRemainingCount: 0,
  pageSize: 20,
  isOfferLoading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_OFFER_PRODUCTS:
      return {...state, ...action.payload};
    case GET_MORE_OFFER_PRODUCTS:
      return {
        ...state,
        ...action.payload,
        products: [...state.products, ...action.payload.products],
      };
    case CLEAR_OFFER:
      return {...initialState};
    case OFFER_LOADING:
      return {
        ...state,
        isOfferLoading: action.payload,
      };
    default:
      return state;
  }
};
