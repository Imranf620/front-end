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

export const getUserDetail = createAsyncThunk("getUserDetail", async( userId, {rejectWithValue})=>{
    try {
        const res = await axios.get(`${baseApi}/admin/user/${userId}`, {
            withCredentials: true,
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const updateUserProfile= createAsyncThunk("updateUserProfile", async (data, {rejectWithValue})=>{
    try {
        const res = await axios.put(`${baseApi}/admin/user/${data.userId}`, data, {
            withCredentials: true,
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const getUserFiles = createAsyncThunk("getUserFiles",async(data, {rejectWithValue})=>{
    try {
        console.log("data is ", data)
        const userId = data.userId;
        const res = await axios.get(`${baseApi}/admin/files`, {
            params:{
                userId: userId,
                orderBy: data.sortBy,
                orderDirection: data.orderDirection,
            },
            withCredentials: true,
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data);

    }
})

export const adminFileDelete = createAsyncThunk("deleteFile", async(fileIds,{rejectWithValue})=>{
    try {
        const res = await axios.delete(`${baseApi}/admin/file`, {
            params:{
                fileIds,
            },
            withCredentials: true,
        })
        console.log(res)
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
        console.log(error);

    }
})


export const deleteUserProfile = createAsyncThunk("deleteUserProfile", async(userId, {rejectWithValue})=>{
    try {
        const res = await axios.delete(`${baseApi}/admin/user/${userId}`, {
            withCredentials: true,
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})