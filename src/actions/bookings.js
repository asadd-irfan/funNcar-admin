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
export const getUserBookingsAndTransactions = async (paramString='', id) => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.getUserBookingsAndTransactions}${id}${paramString}`);
}

// export const deleteBookingById = async (id) => {
//     setAuthToken(localStorage.token);
//     return await API.delete(`${APIUrls.deleteBooking}${id}`);
// }
export const cancelBookingById = async (id, body) => {
    setAuthToken(localStorage.token);
    return await API.post(`${APIUrls.updateBooking}${id}`, body);
}
export const updateBookingById = async (id, body) => {
    setAuthToken(localStorage.token);
    return await API.post(`${APIUrls.updateBooking}${id}`, body);
}

export const getBookingDetails = async (id) => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.getBooking}${id}`);
}

export const getAllCoupons = async (paramString='') => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.coupons}${paramString}`);
}

export const getCoupon = async (id) => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.coupon}${id}`);
}
export const createCoupon = async (body) => {
    setAuthToken(localStorage.token);
    return await API.post(`${APIUrls.coupons}`, body);
}
export const updateCoupon = async (id, body) => {
    setAuthToken(localStorage.token);
    return await API.post(`${APIUrls.coupon}${id}`, body);
}
export const sendDisputeBookingPayment = async (id, body) => {
    setAuthToken(localStorage.token);
    return await API.post(`${APIUrls.disputeBookingPayment}${id}`, body);
}