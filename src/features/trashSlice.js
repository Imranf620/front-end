import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const baseApi = import.meta.env.VITE_API_URL;

export const fetchTrash = createAsyncThunk(
  "/files/fetch",
  async ({ type, sortBy, orderDirection }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseApi}/trash/`, {
        params: {
            orderBy: sortBy,
            orderDirection: orderDirection,type
          },
          withCredentials:true
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


  export const deleteTrash = createAsyncThunk("/files/delete", async (trashId, {rejectWithValue})=>{
    try {
        const res = await axios.delete(`${baseApi}/trash/delete`,  {data:{
          trashIds: trashId,
        },
            withCredentials: true,
          });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  })

  export const restoreFromBin = createAsyncThunk("/files/delete", async (trashId, {rejectWithValue})=>{
    try {
        const res = await axios.post(`${baseApi}/trash/restore/${trashId}`,null,  {
            withCredentials: true,
          });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  })
  export const getAllTrash = createAsyncThunk("/trash/getAll", async({search, orderBy, orderDirection},{rejectWithValue})=>{
    try {
        const res = await axios.get(`${baseApi}/admin/files/trash`, {
          params: {
            search,
            orderBy,
            orderDirection,
          },
          withCredentials: true,
        });
        return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  })



const initialState = {
  loading: false,
  data: [],
  error: null,
  response: null,
};

const trashSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(fetchTrash.pending, (state, action) => {
        state.loading = true;
        state.response = null;
        state.error = null;
      })
     .addCase(fetchTrash.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.response = action.payload;
        state.error = null;
      })
     .addCase(fetchTrash.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.response = action.payload;
      })
     .addCase(deleteTrash.pending, (state, action) => {
        state.loading = true;
        state.response = null;
        state.error = null;
      })
  }
});

export default trashSlice.reducer;
