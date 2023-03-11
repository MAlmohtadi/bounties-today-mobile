import {
  FETCH_DATA_HOME_SCREEN,
  UPDATE_WHOLE_SALE,
  SET_SELECTED_CATEGORY,
  APP_HAS_LOADED,
} from '_actions/types';

const initialState = {
  banners: null,
  adminSettingsResponse: {},
  categories: null,
  isWholeSale: false,
  selectedCategory: {},
  appIsLoading: true,
  deliveryTerms: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATA_HOME_SCREEN:
      return { ...state, ...action.payload, appIsLoading: false };
    case UPDATE_WHOLE_SALE:
      return { ...state, isWholeSale: action.payload, appIsLoading: true };
    case SET_SELECTED_CATEGORY:
      return { ...state, selectedCategory: { ...state.selectedCategory, ...action.payload } };
    case APP_HAS_LOADED:
      return { ...state, appHasLoaded: action.payload };
    default:
      return state;
  }
};
