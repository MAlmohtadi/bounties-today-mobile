import {
  GET_PRODUCTS,
  GET_MORE_PRODUCTS,
  GET_SEARCH_PRODUCTS,
  GET_MORE_SEARCH_PRODUCTS,
  UPDATE_SEARCH_CRITERIA,
  PRODUCT_LOADING,
  CLEAR_PRODUCT,
  ADD_TO_FAVORITE,
  REMOVE_FROM_FAVORITE,
} from '_actions/types';

const initialState = {
  products: [],
  nextPageNumber: 0,
  productsRemainingCount: 0,
  pageSize: 10,
  textToSearch: "",
  maxPrice: null,
  minPrice: null,
  isFilterEnabled: false,
  searchedCategory: null,
  isProductLoading: true,
};

export default (state = initialState, action) => {
  let products;
  switch (action.type) {
    case ADD_TO_FAVORITE:
      products = state.products.map((product) => {
        if (product.id === action.payload.productId) {
          product.isFavorite = true;
        }
        return product;
      });
      return {...state, products};
    case REMOVE_FROM_FAVORITE:
      products = state.products.map((product) => {
        if (product.id === action.payload.productId) {
          product.isFavorite = false;
        }
        return product;
      });
      return {...state, isUpdated: true};
    case GET_PRODUCTS:
    case GET_SEARCH_PRODUCTS:
      return {...state, ...action.payload, isProductLoading: false};
    case GET_MORE_PRODUCTS:
    case GET_MORE_SEARCH_PRODUCTS:
      return {
        ...state,
        ...action.payload,
        isProductLoading: false,
        products: [...state.products, ...action.payload.products],
      };
    case UPDATE_SEARCH_CRITERIA:
      return {...state, ...action.payload, isProductLoading: true};
    case PRODUCT_LOADING:
      return {
        ...state,
        isProductLoading: action.payload,
      };
    case CLEAR_PRODUCT:
      return {...initialState};
    default:
      return state;
  }
};
