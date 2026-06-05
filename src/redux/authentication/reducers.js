import Cookies from 'js-cookie';
import actions from './actions';

const { LOGIN_BEGIN, LOGIN_SUCCESS, LOGIN_ERR, LOGOUT_BEGIN, LOGOUT_SUCCESS, LOGOUT_ERR, SHOW_LOADER } = actions;

const initState = {
  login: Cookies.get('logedIn'),
  loading: true,
  error: null,
};

/**
 *
 * @todo impure state mutation/explaination
 */
const AuthReducer = (state = initState, action) => {
  const { type, data, err } = action;
  switch (type) {
    case LOGIN_BEGIN:
      // debugger
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      // debugger
      return {
        ...state,
        login: data,
        loading: false,
      };
    case LOGIN_ERR:
      // debugger
      return {
        ...state,
        error: err,
        loading: false,
      };
    case LOGOUT_BEGIN:
      // debugger
      return {
        ...state,
        loading: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        login: data,
        loading: false,
      };
    case LOGOUT_ERR:
      return {
        ...state,
        error: err,
        loading: false,
      };
    case SHOW_LOADER:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};
export default AuthReducer;
