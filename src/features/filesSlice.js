import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const baseApi = import.meta.env.VITE_API_URL;

export const fetchFiles = createAsyncThunk(
  "/files/fetch",
  async ({ type, sortBy, orderDirection, keyword }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${baseApi}/files/get/${type}?keyword=${keyword}`,
        {
          params: {
            orderBy: sortBy,
            orderDirection: orderDirection,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadFile = createAsyncThunk(
  "/files/upload",
  async (file, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${baseApi}/files/upload`, file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editFileName = createAsyncThunk(
  "/edit/file",
  async ({ fileId, newName }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${baseApi}/files/edit/name`,
        { fileId, newName },
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getLatestFiles = createAsyncThunk(
  "get/latest",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseApi}/files/get/latest`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteFile = createAsyncThunk(
  "/files/delete",
  async (fileIds, { rejectWithValue }) => {
    try {

      const res = await axios.post(`${baseApi}/trash`, null, {
        params:{fileIds:fileIds},
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const shareFile = createAsyncThunk(
  "/shareFile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${baseApi}/files/share`, data, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSingleFile = createAsyncThunk(
  "/files/getSingleFile",
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseApi}/files/get/file/${fileId}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllAccessibleFiles = createAsyncThunk(
  "/allAccessibleFiles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseApi}/files/get/shared`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFilesSharedByMe = createAsyncThunk(
  "/get/my/shared/files",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseApi}/files/get/sharedByMe`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fileDownload = createAsyncThunk(
  "fileDownload",
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseApi}/files/download/${fileId}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fileView = createAsyncThunk(
  "fileView",
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseApi}/files/view/${fileId}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const invertStatus = createAsyncThunk(
  "invertStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${baseApi}/admin/user/${userId}/status`,
        {},
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadGuestFile = createAsyncThunk(
  "/uploadGuestFile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${baseApi}/files/guest/upload`,
        {
          name: data.selectedFile.name,
          size: data.selectedFile.size,
          type: data.selectedFile.type,
          path: data.publicUrl,
        },
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getGuestFile = createAsyncThunk(
  "/guest/file",
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${baseApi}/files/guest`,{fileId}, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadSocialVideo = createAsyncThunk('/upload-social-video', async(data,{rejectWithValue})=>{
  try {
    const res = await axios.post(`${baseApi}/social/upload`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
})
export const getAllSocialVideos = createAsyncThunk(
  "/social/videos/getAllSocialVideos",
  async ({ search, category, page, limit }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseApi}/social/all`, {
        params: { search, category, page, limit },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



export const deleteMyVideo = createAsyncThunk(
  "/social/videos/getAllSocialVideos",
  async (id , { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${baseApi}/social`, {
        params: { id },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSingleVideo = createAsyncThunk('/video', async(random,{rejectWithValue})=>{
  try {
    const res = await axios.get(`${baseApi}/social`, {
      params: { random },
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

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFiles.pending, (state, action) => {
      state.loading = true;
      state.response = null;
      state.error = null;
    }),
      builder.addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.response = action.payload;
        state.error = null;
      }),
      builder.addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.response = action.payload;
      }),
      builder.addCase(uploadFile.pending, (state, action) => {
        state.loading = true;
        state.response = null;
        state.error = null;
      }),
      builder.addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
        state.error = null;
      }),
      builder.addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.response = action.payload;
      });
  },
});

export default fileSlice.reducer;
