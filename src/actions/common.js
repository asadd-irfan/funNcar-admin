
import API from '../common/API';
import { APIUrls } from '../common/constants';
import setAuthToken from '../utils/setAuthToken';



// export const resetNotificationSetting = () => async dispatch => {
//     dispatch({ type: RESET_NOTIFICATION_SETTING });    
// };

// export const setSidebarKey = (key) => async dispatch => {
//     dispatch({ 
//         type: SET_SIDEBAR_KEY,
//         payload: key
//     });    
// };

export const contactUsList = async (id) => {
    setAuthToken(localStorage.token);
    return await API.get(`${APIUrls.contactUsData}`);
}

export const getDashboardData= async () => {
    setAuthToken(localStorage.token);
    return await API.get(APIUrls.dashboardData);
}
