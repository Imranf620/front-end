import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseApi = import.meta.env.VITE_API_URL;

export const getAllUsers = createAsyncThunk("/admin/users", async (_,{rejectWithValue})=>{

    try {
        const res = await axios.get(`${baseApi}/admin/users`, {
            withCredentials: true,
        })

        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }

})