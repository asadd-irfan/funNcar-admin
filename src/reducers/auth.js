// types
import {
  LOGIN_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  APP_CONFIGS_LOADED,
  LOGOUT_USER,
  SET_NOTIFICATION_COUNT,
  APP_SETTINGS_LOADED,
} from "../actions/types";

import jwtDecode from "jwt-decode";

// initial state
const initialState = {
  token: localStorage.getItem("token"),
  decodedToken: null,
  isAuthenticated: null,
  user: null,
  appConfigs: null,
  notificationCount: 0,
  appSettings: null,
};

// handle actions
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: payload,
      };

    case LOGIN_SUCCESS:
      const decodedToken = jwtDecode(payload.token);
      localStorage.setItem("token", payload.token);
      localStorage.setItem("userType", decodedToken.user.role);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        decodedToken: decodedToken,
      };

    case LOGOUT_USER:
      localStorage.clear();
      return {
        ...state,
        token: null,
        decodedToken: null,
        isAuthenticated: null,
        user: null,
        appConfigs: null,
        data: null,
      };

    case AUTH_ERROR:
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      return {
        ...state,
        isAuthenticated: false,
      };

    case APP_CONFIGS_LOADED: {
      return {
        ...state,
        appConfigs: payload,
      };
    }
    case APP_SETTINGS_LOADED: {
      return {
        ...state,
        appSettings: payload,
      };
    }
    case SET_NOTIFICATION_COUNT:
      return {
        ...state,
        notificationCount: payload,
      };

    default:
      return state;
  }
}
