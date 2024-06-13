import {configureStore} from "@reduxjs/toolkit";
import userReducer from '../redux/userSlice';



export const appStore = configureStore({
    reducer: {
        user: userReducer,

    }
})