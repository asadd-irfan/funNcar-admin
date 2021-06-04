import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { logoutUser } from "../../actions/auth";
import { useSelector, useDispatch } from 'react-redux'
// import storeConfig from "../../store";

const PrivateRoute = ({ component: Component, layout: Layout, ...rest }) => {
    // const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const token = localStorage.token;
    const { isAuthenticated, user } = auth;
    const isAuthorized = token && isAuthenticated && user && user.role === 'admin';
    if (!isAuthorized){
        // storeConfig.store.dispatch(logoutUser())
        // dispatch(logoutUser())
		return <Redirect to='/login' />
    }
    else return <Route {...rest} render={props => <Component {...props} />} />;
};

export default PrivateRoute;
