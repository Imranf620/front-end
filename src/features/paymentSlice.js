import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const baseApi = import.meta.env.VITE_API_URL;


export const buyPackage = createAsyncThunk("/pay", async(data,{rejectWithValue})=>{

    try {
        const res = await axios.post(`${baseApi}/payment`, data, {
            withCredentials: true, 
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
        
    }
})

export const getPricing = createAsyncThunk("/get/price", async(_,{rejectWithValue})=>{

    try {
        const res = await axios.get(`${baseApi}/payment`, {
            withCredentials: true, 
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
        
    }
})