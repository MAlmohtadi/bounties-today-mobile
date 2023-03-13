import {
  SUBMIT_ORDER,
  UPDATE_CHECKOUT_DETAILS,
  GET_CHECKOUT_INFO,
  GET_COUPON_BY_CODE,
  CLEAR_CHECKOUT,
  CLEAR_COUPON,
  GET_DELIVERY_INFO,
} from '_actions/types';

const initialState = {
  location: null,
  deliveryDate: null,
  deliveryPeriod: null,
  deliveryPrice: 0,
  branchId: 0,
  typeOfPayment: 1,
  notes: '',
  couponCode: null,

  couponInfo: {
    code: null,
    percentage: null,
    discountAmount: null,
    isPercentage: null,
    minOrderPrice: null,
    validate: false,
  },
  orderSubmitted: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_ORDER:
      return {...state, orderSubmitted: true};
    case UPDATE_CHECKOUT_DETAILS:
    case GET_DELIVERY_INFO:
      return {...state, ...action.payload};
    case GET_CHECKOUT_INFO:
      return {...state, deliveryInfo: [...action.payload.deliveryInfo]};
    case GET_COUPON_BY_CODE:
      return {...state, couponInfo: {...action.payload, validate: true}};
    case CLEAR_COUPON:
      return {
        ...state,
        couponInfo: {...initialState.couponInfo},
        couponCode: null,
      };
    case CLEAR_CHECKOUT:
      return {...state, ...initialState};
    default:
      return state;
  }
};
