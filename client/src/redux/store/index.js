import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import UserReducer from "../reducers/User.reducer";
import AddressReducer from "../reducers/Address.reducer";
import NavbarReducer from "../reducers/Navbar.reducer";
import CookiesReducer from "../reducers/Cookies.reducer";

const rootReducer = combineReducers({
    user: UserReducer,
    address: AddressReducer,
    navbarShow: NavbarReducer,
    allowCookies: CookiesReducer
})

const store = configureStore({
    reducer: rootReducer
});

export default store;