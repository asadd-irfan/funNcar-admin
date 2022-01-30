import setAuthToken from "../utils/setAuthToken";
import { APIUrls, APP_ERROR_MSGS } from "../common/constants";
import API from "../common/API";
import {
  UPDATE_LOADING,
  LOGOUT_USER,
  LOGIN_SUCCESS,
  USER_LOADED,
  APP_CONFIGS_LOADED,
  SHOW_ALERT,
  AUTH_ERROR,
  APP_SETTINGS_LOADED,
} from "./types";

// User

export const loadUser = () => async (dispatch) => {
  //set header
  if (localStorage.token) {
    setAuthToken(localStorage.token);
    try {
      await API.get(APIUrls.GetMe).then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        dispatch({ type: USER_LOADED, payload: result.data });
      });
    } catch (error) {
      // console.log(error)
      dispatch({ type: AUTH_ERROR });
      dispatch({ type: UPDATE_LOADING, payload: false });
      dispatch({
        type: SHOW_ALERT,
        payload: {
          type: 0,
          message: error?.response?.data?.error
            ? error?.response?.data?.error
            : APP_ERROR_MSGS.StandardErrorMsg,
        },
      });
    }
  } else {
    dispatch({ type: UPDATE_LOADING, payload: false });
  }
};
export const loginUser = ({ email, password }) => async (dispatch) => {
  dispatch({ type: UPDATE_LOADING, payload: true });
  // set header
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // set body
  const body = JSON.stringify({ email, password });
  try {
    // login user
    const res = await API.post(APIUrls.Login, body, config);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch(loadUser());
    dispatch(loadAppConfigs());
    dispatch(loadAppSettings());
  } catch (error) {
    dispatch({ type: UPDATE_LOADING, payload: false });
    dispatch({
      type: SHOW_ALERT,
      payload: {
        type: 0,
        message: error?.response?.data?.error
          ? error?.response?.data?.error
          : APP_ERROR_MSGS.StandardErrorMsg,
      },
    });
  }
};
export const logoutUser = () => async (dispatch) => {
  setAuthToken();
  dispatch({ type: LOGOUT_USER });
};

// Configs

export const getAllCountries = async () => {
  setAuthToken(localStorage.token);
  return await API.get(APIUrls.GetAllCountries);
};
export const getCities = async (id = "") => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.GetCities}?countryId=${id}`);
};
export const getDummyServices = async () => {
  setAuthToken(localStorage.token);
  return await API.get(APIUrls.GetDummyServices);
};
export const loadAppConfigs = () => async (dispatch) => {
  //set header
  setAuthToken(localStorage.token);
  try {
    await API.get(APIUrls.getAppConfigs).then((result) => {
      if (result.data.status === true) {
        dispatch({ type: APP_CONFIGS_LOADED, payload: result.data });
      } else {
        dispatch({
          type: SHOW_ALERT,
          payload: { type: 0, message: result.data.message },
        });
      }
    });
  } catch (error) {
    dispatch({
      type: SHOW_ALERT,
      payload: {
        type: 0,
        message: error?.response?.data?.error
          ? error?.response?.data?.error
          : "Error in getting app configs",
      },
    });
  }
};
export const loadAppSettings = () => async (dispatch) => {
  //set header
  setAuthToken(localStorage.token);
  try {
    await API.get(APIUrls.appSettings).then((result) => {
      if (result.data.status === true) {
        dispatch({ type: APP_SETTINGS_LOADED, payload: result.data.data });
      } else {
        dispatch({
          type: SHOW_ALERT,
          payload: { type: 0, message: result.data.message },
        });
      }
    });
  } catch (error) {
    dispatch({
      type: SHOW_ALERT,
      payload: {
        type: 0,
        message: error?.response?.data?.error
          ? error?.response?.data?.error
          : "Error in getting app configs",
      },
    });
  }
};

export const getAppConfigs = async () => {
  setAuthToken(localStorage.token);
  return await API.get(APIUrls.getAppConfigs);
};
export const deleteConfiguration = async (id = "") => {
  setAuthToken(localStorage.token);
  return await API.delete(`${APIUrls.DeleteConfiguration}${id}`);
};
export const saveConfig = async (param) => {
  setAuthToken(localStorage.token);
  return await API.post(APIUrls.saveConfiguration, param);
};
export const updateConfig = async (id, param) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.UpdateConfiguration}${id}`, param);
};
export const getConfigDetail = async (id = "") => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.GetConfigDetail}${id}`);
};
