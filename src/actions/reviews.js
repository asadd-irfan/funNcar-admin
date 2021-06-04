import API from '../common/API';
import { APIUrls } from '../common/constants';
import setAuthToken from '../utils/setAuthToken';


export const getAllFunncarReviews = async (id, paramString='') => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.getAllReviews}${id}${paramString}`);
}

export const deleteAReview = async (id='') => {
    setAuthToken(localStorage.token);
    return await API.delete(`${APIUrls.deleteReview}${id}`);
}