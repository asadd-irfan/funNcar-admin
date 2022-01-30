import API from "../common/API";
import { APIUrls } from "../common/constants";
import setAuthToken from "../utils/setAuthToken";

export const getWebsiteHomePageData = async (type) => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.getWebsiteHomepageData}${type}`);
};
export const uploadWebsiteHomePageFile = async (type,param) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.uploadWebsiteHomepageFile}${type}`, param);
};
export const deleteWebsiteHomePageFile = async (id, param) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.deleteWebsiteHomepageFile}${id}`, param);
};
