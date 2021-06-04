import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { loginUser } from '../actions/auth';
import { Redirect } from 'react-router-dom';
import './index.css';
import { useAlert } from 'react-alert'

const Login = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const dispatch = useDispatch();
    const alert = useAlert();

    const token = localStorage.token;
    const auth = useSelector(state => state.auth);
    const { isAuthenticated, user } = auth;

    if (token && user && isAuthenticated ) return <Redirect to='/admin' />;

    const handleChangeEmail = (event) => setEmail(event.target.value)
    const handleChangePassword = (event) => setPassword(event.target.value)

    const onSubmitForm = (event) => {
        event.preventDefault();
        if (email && email != '' && password && password != ''){
            dispatch(loginUser({ email, password }));
        }
        else
        alert.error("Email and password are required.")
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={onSubmitForm}>
                    <h3>Admin Login</h3>

                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email" onChange={handleChangeEmail} />
                    </div>

                    <div className="form-group mb-5">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" onChange={handleChangePassword} />
                    </div>

                    {/* <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div> */}

                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                    {/* <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p> */}
                </form>
            </div></div>
    );

}

export default Login;