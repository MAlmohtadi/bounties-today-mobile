import {combineReducers} from 'redux';
import alertReducer from './alertReducer';
import homeReducer from './homeReducer';
import productReducer from './productReducer';
import cartReducer from './cartReducer';
import favoriteReducer from './favoriteReducer';
import goldenCardReducer from './goldenCardReducer';
import userCouponReducer from './userCouponReducer';
import offerReducer from './offerReducer';
import checkoutReducer from './checkoutReducer';
import authReducer from './authReducer';
import orderReducer from './orderReducer';
import configReducer from './configReducer';
import cartWholesaleReducer from './cartWholesaleReducer';
import navigationReducer from './navigationReducer';

export default combineReducers({
  alertReducer,
  homeReducer,
  productReducer,
  cartReducer,
  favoriteReducer,
  offerReducer,
  checkoutReducer,
  authReducer,
  orderReducer,
  configReducer,
  navigationReducer,
  cartWholesaleReducer,
  goldenCardReducer,
  userCouponReducer,
});
