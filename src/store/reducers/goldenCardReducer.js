import {
  GET_LOYALTY_INFO,
  LOAD_LOYALTY_SCREEN,
  CONVERT_POINTS_TO_COUPON
} from '_actions/types';

const initialState = {
  onlinePoints: 0,
  storePoints: 0,
  termsOfService: [],
  isGoldenCardLoading: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_LOYALTY_INFO:
      return { ...state,...action.payload, isGoldenCardLoading: false };
    case CONVERT_POINTS_TO_COUPON:
      return { ...state,...action.payload , isGoldenCardLoading: false};
    case LOAD_LOYALTY_SCREEN:
      return { ...state , isGoldenCardLoading: true};
    // case CLEAR_FAVORITE:
    //   return { ...state, products: [], isUpdated: false };
    // case TOGGLE_FAVORITE_FLAG:
    //   return { ...state, isUpdated: !state.isUpdated };
    // case GET_FAVORITE_PRODUCTS:
    //   return { ...state, products: [...action.payload], isUpdated: false, isLoading: false };
    // case FAVORITE_UNSUBSCRIBE:
    //   return { ...initialState };
    default:
      return state;
  }
};
