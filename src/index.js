import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './index.css';

// redux
import { Provider } from "react-redux";
import storeConfig from "./store";
import { PersistGate } from 'redux-persist/es/integration/react'
import "../src/assets/css/material-dashboard-react.css?v=1.9.0";


ReactDOM.render(
    <Provider store={storeConfig.store}>
        <PersistGate loading={null} persistor={storeConfig.persistor} >
            <App store={storeConfig.store} />
        </PersistGate>
    </Provider>,
    document.getElementById("root")
);
