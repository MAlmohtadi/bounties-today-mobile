import {
  ADD_TO_FAVORITE,
  CLEAR_FAVORITE,
  REMOVE_FROM_FAVORITE,
  GET_FAVORITE_PRODUCTS,
  GET_LOYALTY_INFO,
  LOAD_LOYALTY_SCREEN,
  TOGGLE_FAVORITE_FLAG,
  SHOW_INVALID_POINTS_ALERT,
  SET_ALERT,
  FAVORITE_UNSUBSCRIBE,
} from './types';
import {api} from '../../config/Api';
import {END_POINTS, METHODS} from '_utils/services';


export const getLoyaltyInfo = (data, showSuccessAlert) => (dispatch) => {
  api(END_POINTS.getLoyaltyInfo, data, METHODS.POST)
    .then((res) => {
      console.log("essss", {ddd: res.data})
      dispatch({
        type: GET_LOYALTY_INFO,
        payload: res.data,
      });
      if(showSuccessAlert){
      
      }
    })
    .catch((err) => {
      console.error(err);

      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};


export const loadLoyaltyScreen = () => (dispatch) => {
  dispatch({
    type: LOAD_LOYALTY_SCREEN,
  });
};


export const showInvalidPointsAlert = () => (dispatch) => {
  dispatch({
    type: SET_ALERT,
    payload: {message:' اقل عدد نقاط لطلب كوبون هو 1000 نقطة'},
  });
};

export const convertPointsToCoupon = (data) => (dispatch) => {
  api(END_POINTS.convertPointsToCoupon, data, METHODS.POST)
    .then((res) => {
      api(END_POINTS.getLoyaltyInfo, data, METHODS.POST)
      .then((res) => {
        console.log("essss", {ddd: res.data})
        dispatch({
          type: GET_LOYALTY_INFO,
          payload: res.data,
        });
        dispatch({
          type: SET_ALERT,
          payload: {message:' تم طلب كوبون, سيتم اصدار الكوبون خلال يومان يرجى متابعة شاشه الكوبونات'},
        });
      })
      .catch((err) => {
        console.error(err);
  
        dispatch({
          type: SET_ALERT,
          payload: {...err},
        });
      });
     
    
    })
    .catch((err) => {
      console.error(err);

      dispatch({
        type: SET_ALERT,
        payload: {...err},
      });
    });
};

// export const addToFavorite = (data) => (dispatch) => {
//   api(END_POINTS.addFavorite, data, METHODS.POST)
//     .then((res) => {
//       dispatch({
//         type: ADD_TO_FAVORITE,
//         payload: data,
//       });
//     })
//     .catch((err) => {
//       console.error(err);

//       dispatch({
//         type: SET_ALERT,
//         payload: {...err},
//       });
//     });
// };

// export const removeFromFavorite = (data) => (dispatch) => {
//   api(END_POINTS.deleteFavorite, data, METHODS.POST)
//     .then((res) => {
//       dispatch({
//         type: REMOVE_FROM_FAVORITE,
//         payload: data,
//       });
//     })
//     .catch((err) => {
//       console.error(err);

//       dispatch({
//         type: SET_ALERT,
//         payload: {...err},
//       });
//     });
// };

// export const clearFavorite = (data) => (dispatch) => {
//   api(END_POINTS.deleteAllFavorite, data, METHODS.POST)
//     .then((res) => {
//       dispatch({
//         type: CLEAR_FAVORITE,
//         payload: data,
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//       dispatch({
//         type: SET_ALERT,
//         payload: {...err},
//       });
//     });
// };


// export const toggleFavoriteFlag = () => (dispatch) => {
//   dispatch({
//     type: TOGGLE_FAVORITE_FLAG,
//   });
// };

// export const clearFavoriteScreen = () => (dispatch) => {
//   dispatch({
//     type: FAVORITE_UNSUBSCRIBE,
//   });
// };
