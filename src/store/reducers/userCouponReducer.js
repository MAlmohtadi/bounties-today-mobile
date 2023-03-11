import {
  GET_USER_COUPON,
  LOAD_LOYALTY_SCREEN,
  CONVERT_POINTS_TO_COUPON
} from '_actions/types';

const initialState = {
  coupons: [],
  isUserCouponLoading: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_COUPON:
      return { ...state,...action.payload, isUserCouponLoading: false };
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
