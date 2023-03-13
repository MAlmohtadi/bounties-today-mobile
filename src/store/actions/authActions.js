import {
  REGISTER_USER,
  LOGIN_USER,
  UPDATE_USER,
  LOGOUT_USER,
  SET_ALERT,
  SET_USER_UPDATED,
  DELETE_USER,
} from './types';
import {api} from '../../config/Api';
import {END_POINTS, METHODS} from '_utils/services';
export const registerUser = data => dispatch => {
  api(END_POINTS.register, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: REGISTER_USER,
        payload: res.data,
      });
      dispatch({
        type: SET_ALERT,
        payload: {message: 'تم تسجيلك بنجاح', status: 1},
      });
    })
    .catch(err => {
      console.error(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};

export const loginUser = data => dispatch => {
  console.log('data:', data);
  api(END_POINTS.login, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: LOGIN_USER,
        payload: res.data,
      });
      dispatch({
        type: SET_ALERT,
        payload: {message: 'تم تسجيل الدخول بنجاح', status: 1},
      });
    })
    .catch(err => {
      console.error(err);

      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};
export const updateUser = data => dispatch => {
  console.log('data:', data);
  api(END_POINTS.login, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: UPDATE_USER,
        payload: res.data,
      });
    })
    .catch(err => {
      console.error(err);

      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};
export const deleteUser = data => dispatch => {
  console.log('data:', data);
  api(END_POINTS.deleteUser, data, METHODS.POST)
    .then(res => {
      dispatch({
        type: DELETE_USER,
        payload: res.data,
      });
    })
    .catch(err => {
      console.error(err);
      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};
export const setUserUpdated = flag => dispatch => {
  dispatch({
    type: SET_USER_UPDATED,
    payload: flag,
  });
};
export const logoutUser = () => dispatch => {
  dispatch({
    type: LOGOUT_USER,
  });
};
