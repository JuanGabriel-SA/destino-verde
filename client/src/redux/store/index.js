import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import UserReducer from "../reducers/User.reducer";
import AddressReducer from "../reducers/Address.reducer";
import CookiesReducer from "../reducers/Cookies.reducer";
import MarkersReducer from "../reducers/Markers.reducer";
import UserCoordinatesReducer from "../reducers/UserCoordinates.reducer";

const rootReducer = combineReducers({
    user: UserReducer,
    address: AddressReducer,
    allowCookies: CookiesReducer,
    markers: MarkersReducer,
    userCoordinates: UserCoordinatesReducer
})

const store = configureStore({
    reducer: rootReducer
});

export default store;