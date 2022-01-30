import API from "../common/API";
import { APIUrls } from "../common/constants";
import setAuthToken from "../utils/setAuthToken";

export const getUsers = async (paramString = "") => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.GetUsers}${paramString}`);
};

export const deleteUser = async (id = "") => {
  setAuthToken(localStorage.token);
  return await API.delete(`${APIUrls.DeleteUsers}${id}`);
};

export const getUserDetail = async (id = "") => {
  setAuthToken(localStorage.token);
  return await API.get(`${APIUrls.GetUserDetail}${id}`);
};

export const updateUser = async (id, param) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.UpdateUser}${id}`, param);
};

export const uploadUserImage = async (id, param) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.UploadUserImage}${id}`, param);
};

export const approveUser = async (id) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.ApproveUser}${id}`);
};

export const verifyUser = async (id) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.VerifyUser}${id}`);
};

export const deleteUserGallery = async (id, param) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.RemoveUserGallery}${id}`, param);
};

export const uploadUserGallery = async (id, param) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.UploadUserGallery}${id}`, param);
};

export const filterFunncars = async (body, query = "") => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.FilterFunncar}${query}`, body);
};
export const filterPerformers = async (body, query = "") => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.FilterPerformer}${query}`, body);
};
export const filterUsers = async (body, query = "") => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.FilterUser}${query}`, body);
};

export const updateWallet = async (id, body) => {
  setAuthToken(localStorage.token);
  return await API.post(`${APIUrls.updateUserWallet}${id}`, body);
};