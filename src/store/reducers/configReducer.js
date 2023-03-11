import {SET_ACTIVE_VIEW, SET_SORT_TYPE} from '_actions/types';

const initialState = {
  isGridView: true,
  sortType: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_VIEW:
      return {...state, isGridView: action.payload};
    case SET_SORT_TYPE:
      return {...state, sortType: action.payload};
    default:
      return state;
  }
};
