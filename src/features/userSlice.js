import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const baseApi = import.meta.env.VITE_API_URL;


export const login = createAsyncThunk("/login", async(data,{rejectWithValue})=>{
    
    try {
        const res = await axios.post(`${baseApi}/user/login`, data, {
            withCredentials: true, 
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
        
    }
})

export const signUp = createAsyncThunk("/signUp",async (data,{rejectWithValue})=>{

    try {
        const res = await axios.post(`${baseApi}/user/register`, data, { withCredentials: true, })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
        
    }
})

export const fetchMyProfile = createAsyncThunk("/fetch/my-profile",
    async(_,{rejectWithValue})=>{
        try {
            const res = await axios.get(`${baseApi}/user/me`, {
                withCredentials: true, 
            })
            console.log(res.data)
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
export const logout = createAsyncThunk("/logout",async(_,{rejectWithValue})=>{

        try {
            const res = await axios.get(`${baseApi}/user/logout`, {
                withCredentials: true, 
            })
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    
})

export const updateProfile = createAsyncThunk("/update/profile", async (data, { rejectWithValue }) => {
    try {
        console.log(data)
      const res = await axios.put(`${baseApi}/user/update`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });


  export const forgotPassword = createAsyncThunk("/forget", async(email,{rejectWithValue})=>{

        try {
            const res = await axios.post(`${baseApi}/user/forget/password`, email, {
                withCredentials: true, 
            })
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    
  })

  export const resetPassword = createAsyncThunk("/forget", async(data,{rejectWithValue})=>{

    try {
        const res = await axios.post(`${baseApi}/user/reset/password`, data, {
            withCredentials: true, 
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }

})

  


const initialState = {
    user:null,
    isLoggedIn:false,
    loading:false,
    error:null,
    response:null
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:builder=>{
        builder.addCase(login.pending,(state,action)=>{
            state.response = null;
            state.error = null;
            state.loading = true;
        }),
        builder.addCase(login.fulfilled,(state,action)=>{
            state.user = action.payload.data;
            state.isLoggedIn = true;
            state.response = action.payload;
            state.error = null;
            state.loading = false;
        }),
        builder.addCase(login.rejected,(state,action)=>{
            state.response = action.payload;
            state.error = action.payload;
            state.loading = false;
        }),
        builder.addCase(signUp.pending,(state,action)=>{
            state.response = null;
            state.error = null;
            state.loading = true;
        })
        builder.addCase(signUp.fulfilled,(state,action)=>{
            state.user = action.payload.data;
            state.isLoggedIn = true;
            state.response = action.payload;
            state.error = null;
            state.loading = false;
        }),
        builder.addCase(signUp.rejected,(state,action)=>{
            state.response = action.payload;
            state.error = action.payload;
            state.loading = false;
        }),
        builder.addCase(fetchMyProfile.pending,(state,action)=>{
            state.response = null;
            state.error = null;
            state.loading = true;
        }),
        builder.addCase(fetchMyProfile.fulfilled,(state,action)=>{
            state.user = action.payload.data;
            state.isLoggedIn = true;
            state.response = action.payload;
            state.error = null;
            state.loading = false;
        }),
        builder.addCase(fetchMyProfile.rejected,(state,action)=>{
            // state.response = action.payload;
            state.error = action.payload;
            state.loading = false;
        }),
        builder.addCase(logout.pending,(state,action)=>{
            state.response = null;
            state.error = null;
            state.loading = true;
        }),
        builder.addCase(logout.fulfilled,(state,action)=>{
            state.user = null;
            state.isLoggedIn = false;
            state.response = action.payload;
            state.error = null;
            state.loading = false;
        }),
        builder.addCase(logout.rejected,(state,action)=>{
            state.response = action.payload;
            state.error = action.payload;
            state.loading = false;
        }),
        builder.addCase(updateProfile.pending,(state,action)=>{
            state.response = null;
            state.error = null;
            state.loading = true;
        }),
        builder.addCase(updateProfile.fulfilled,(state,action)=>{{
            state.user = action.payload.data;
            state.response = action.payload;
            state.error = null;
            state.loading = false;
        }})
        builder.addCase(updateProfile.rejected,(state,action)=>{
            state.response = action.payload;
            state.error = action.payload;
            state.loading = false;
        })
    }
})

export default authSlice.reducer;