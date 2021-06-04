import API from '../common/API';
import { APIUrls } from '../common/constants';
import setAuthToken from '../utils/setAuthToken';

export const getAllBookings = async (paramString='') => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.getAllBookings}${paramString}`);
}
export const getUserBookings = async (paramString='', id) => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.getUserBookings}${id}${paramString}`);
}
export const getFunncarBookings = async (paramString='', id) => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.getFunncarBookings}${id}${paramString}`);
}

export const deleteBookingById = async (id) => {
    setAuthToken(localStorage.token);
    return await API.delete(`${APIUrls.deleteBooking}${id}`);
}

export const getBookingDetails = async (id) => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.getBooking}${id}`);
}