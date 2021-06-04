import API from '../common/API';
import { APIUrls } from '../common/constants';
import setAuthToken from '../utils/setAuthToken';


export const getHomePageData = async (type) => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.getHomepageData}${type}`);
}
export const getHomePopularFunncar = async () => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.homePopularFunncar}`);
}
export const getHomePopularPerformer = async () => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.homePopularPerformer}`);
}
export const updateHomePageData = async (id,param) => {
    setAuthToken(localStorage.token);
    return await API.post(`${APIUrls.updateHomepageData}${id}`,param);
}
export const uploadHomePageFile = async (type,param) => {
    setAuthToken(localStorage.token);
    return await API.post(`${APIUrls.uploadHomepageFile}${type}`,param);
}
export const deleteHomePageFile = async (id, param) => {
    setAuthToken(localStorage.token);
    return await API.post(`${APIUrls.deleteHomepageFile}${id}`, param);
}

// export const deleteAReview = async (id='') => {
//     setAuthToken(localStorage.token);
//     return await API.delete(`${APIUrls.deleteReview}${id}`);
// }