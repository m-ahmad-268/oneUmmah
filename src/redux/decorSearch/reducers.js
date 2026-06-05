import { SET_DECOR_SEARCH_QUERY, SET_DECOR_SEARCH_PAGINATION, RESET_DECOR_SEARCH } from './actions';

const initialState = {
  searchQuery: '',
  pagination: { current: 1, pageSize: 10 },
};

const decorSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DECOR_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case SET_DECOR_SEARCH_PAGINATION:
      return { ...state, pagination: action.payload };
    case RESET_DECOR_SEARCH:
      return initialState;
    default:
      return state;
  }
};

export default decorSearchReducer;
