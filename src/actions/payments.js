import API from '../common/API';
import { APIUrls } from '../common/constants';
import setAuthToken from '../utils/setAuthToken';

export const getAllTransactions = async (paramString='') => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.getTransactions}${paramString}`);
}
export const getUserTransactions = async (id,paramString='') => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.userTransactions}${id}${paramString}`);
}
export const getFunncarWalletHistory = async (id,paramString='') => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.funncarWalletHistory}${id}${paramString}`);
}

export const getPaymentRequests = async (paramString='') => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.allPaymentRequests}${paramString}`);
}
export const getFunncarPaymentRequests = async (id,paramString='') => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.funcarPaymentRequests}${id}${paramString}`);
}

export const getPaymentRequest = async (id) => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.paymentRequest}${id}`);
}
export const sendPaymentToFunncar = async (id, body) => {
    setAuthToken(localStorage.token);
    return await API.post(`${APIUrls.sendPayment}${id}`, body);
}
