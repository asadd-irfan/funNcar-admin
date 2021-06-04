import API from '../common/API';


const setAuthToken = token => {
    if (token)
    API.defaults.headers.common['Authorization'] = 'Bearer '+token;
    else
    API.defaults.headers.common['Authorization'] = null;
}

export default setAuthToken;