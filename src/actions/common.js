import API from "../common/API";
import { APIUrls } from "../common/constants";
import setAuthToken from "../utils/setAuthToken";

// export const resetNotificationSetting = () => async dispatch => {
//     dispatch({ type: RESET_NOTIFICATION_SETTING });
// };

// export const setSidebarKey = (key) => async dispatch => {
//     dispatch({
//         type: SET_SIDEBAR_KEY,
//         payload: key
//     });
// };

export const contactUsList = async (paramString = "") => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.contactUsData}${paramString}`);
};
export const subscribeEmailList = async () => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.subscribeEmailData}`);
};
export const termsConditions = async (param) => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.termsCondition}${param}`);
};
export const termPrivacy = async (body, id) => {
  setAuthToken(localStorage.token);
  return await API.patch(`${APIUrls.staticPage}/${id}`, body);
};
export const postNewPrivacy = async (body, id) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.staticPage}`, body);
};
export const allNotifications = async (paramString = "") => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.notificationsList}${paramString}`);
};
export const markReadNotification = async (id) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.readNotification}${id}`, {});
};

export const videoCallRecordsList = async (paramString = "") => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.callRecordsList}${paramString}`);
};
export const videoCallRecordsOfBooking = async (id) => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.callRecordsOfBooking}${id}`);
};

// Dashboard APIs start
export const getWallet = async () => {
  setAuthToken(localStorage.token);
  return await API.get(APIUrls.getWallet);
};
export const getTableStats = async (paramString = "") => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.getTableList}${paramString}`);
};
export const getDashboardData = async () => {
  setAuthToken(localStorage.token);
  return await API.get(APIUrls.dashboardData);
};
// Dashboard APIs end

export const getAppSettings = async () => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.appSettings}`);
};

export const updateAppSettings = async (body) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.appSettingsUpdate}`, body);
};
