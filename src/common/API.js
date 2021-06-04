import axios from 'axios';
import storeConfig from '../store';
import { logoutUser } from "../actions/auth";
import { Redirect } from 'react-router-dom';
import React from 'react';

const API = axios.create({
    headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}
});

API.interceptors.response.use(response=>response,error=>{
	  if (401 === error.response?.status || error.response.data.error==="jwt expired"){
        storeConfig.store.dispatch(logoutUser())
		return <Redirect to='/login' />
	}else{
		return Promise.reject(error);
	}
  }
);

export default API;