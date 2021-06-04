import { combineReducers } from "redux";
import auth from "./auth";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import loader from "./loader";
import alert from "./alert";

const persistUserConfig = {
  key: 'user',
  storage,
};
const persistedUserConfig = persistReducer(persistUserConfig, auth);

const AllReducers = combineReducers({
  auth: persistedUserConfig,
  loader,
  alert,
})

export default AllReducers;