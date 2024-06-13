import {configureStore} from "@reduxjs/toolkit";
import userReducer from '../redux/userSlice';
import followReducer from '../redux/followSlice'



export const appStore = configureStore({
    reducer: {
        user: userReducer,
        follow: followReducer

    }
})