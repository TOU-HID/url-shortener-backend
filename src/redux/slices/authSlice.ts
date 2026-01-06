import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import type { AuthState, AuthResponse } from '../../types';

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunks

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserUrlCount: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.urlCount = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        // Save to localStorage
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        // Save to localStorage
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, updateUserUrlCount } = authSlice.actions;
export default authSlice.reducer;