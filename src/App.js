
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { loadAppConfigs, loadAppSettings, loadUser } from './actions/auth';
import AlertWrapper from './alertWrapper'
// core components
import Admin from "./layouts/Admin.js";
import Login from "./auth/Login";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './components/Routing/PrivateRoutes';
import { Provider as AlertProvider, transitions } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import LoadingOverlay from 'react-loading-overlay';
import setAuthToken from './utils/setAuthToken';


const history = createBrowserHistory();

// let loggedIn = () => {
//   return localStorage.token;
// };
// const AdminDashboard = () => {
//   return loggedIn && localStorage.userType == "admin" ? (
//     <Switch>
//       <PrivateRoute path="/admin" component={Admin} />
//     </Switch>
//   ) : <Redirect to='/login' />;
// }

const alertOptions = {
  offset: '25px',
  timeout: 5000,
  transition: transitions.SCALE
}

const App = ({ store }) => {
  const isLoading = useSelector(state => state.loader.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    setAuthToken(localStorage.token);
    store.dispatch(loadUser());
    store.dispatch(loadAppConfigs());
    store.dispatch(loadAppSettings());
  }, []);


  return (<>
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <AlertWrapper />
      <LoadingOverlay
        active={isLoading}
        spinner
        styles={{
          overlay: (base) => ({
            ...base,
            background: 'rgba(0,0,0,0.08)'
          })
        }}
      >
        <Router history={history}>
          <Switch>
            <Route path='/login' component={Login} />
            <PrivateRoute path="/admin" component={Admin} />
            {/* <AdminDashboard /> */}
            <Redirect from="/" to='/login' />
          </Switch>
        </Router>
      </LoadingOverlay>
    </AlertProvider>
  </>);
};

export default App;
