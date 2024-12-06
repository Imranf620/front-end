import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./features/userSlice"
import fileSlice from "./features/filesSlice"
import trashSlice from "./features/trashSlice"


const store = configureStore({
    reducer:{
        auth:authSlice,
        files:fileSlice,
        trash:trashSlice
    }
})

export default store;