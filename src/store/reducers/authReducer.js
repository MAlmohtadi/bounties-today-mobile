import {
  REGISTER_USER,
  LOGIN_USER,
  UPDATE_USER,
  LOGOUT_USER,
  SET_USER_UPDATED,
  DELETE_USER,
} from '_actions/types';

const initialState = {
  id: null,
  email: null,
  name: null,
  phone: null,
  facebookId: null,
  appleId: null,
  secondaryPhone: null,
  isUserUpdated: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
    case LOGIN_USER:
    case UPDATE_USER:
      return {...state, ...action.payload, isUserUpdated: true};
    case SET_USER_UPDATED:
      return {...state, ...action.payload, isUserUpdated: action.payload};
    case DELETE_USER:
    case LOGOUT_USER:
      return {...state, ...initialState};
    default:
      return state;
  }
};
