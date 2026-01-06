import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import type { UrlState, UrlsResponse, CreateUrlResponse } from '../../types';

const initialState: UrlState = {
  urls: [],
  totalCount: 0,
  limit: 100,
  loading: false,
  error: null,
};

// Get all URLs
export const fetchUrls = createAsyncThunk(
  'url/fetchUrls',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<UrlsResponse>('/urls');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Create short URL
export const createShortUrl = createAsyncThunk(
  'url/createShortUrl',
  async (originalUrl: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<CreateUrlResponse>('/urls', { originalUrl });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete URL
export const deleteUrl = createAsyncThunk(
  'url/deleteUrl',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/urls/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// URL slice
const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    incrementUrlClick: (state, action) => {
      const urls = state.urls.map((url) => {
        if (url._id === action.payload) {
          url.clicks += 1;
        }
        return url;
      });
      state.urls = urls;
    },
  },

  extraReducers: (builder) => {
    // Fetch URLs
    builder
      .addCase(fetchUrls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = action.payload.data.urls;
        state.totalCount = action.payload.data.totalCount;
        state.limit = action.payload.data.limit;
      })
      .addCase(fetchUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create URL
    builder
      .addCase(createShortUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShortUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.urls.unshift(action.payload.data); // Add to beginning of array
        state.totalCount += 1;
      })
      .addCase(createShortUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete URL
    builder
      .addCase(deleteUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = state.urls.filter((url) => url._id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, incrementUrlClick } = urlSlice.actions;
export default urlSlice.reducer;