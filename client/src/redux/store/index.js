import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import UserReducer from "../reducers/User.reducer";
import AddressReducer from "../reducers/Address.reducer";
import NavbarReducer from "../reducers/Navbar.reducer";

const rootReducer = combineReducers({
    user: UserReducer,
    address: AddressReducer,
    navbarShow: NavbarReducer
})

const store = configureStore({
    reducer: rootReducer
});

export default store;