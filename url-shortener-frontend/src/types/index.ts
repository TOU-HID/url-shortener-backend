// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  urlCount: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// URL Types
export interface Url {
  _id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export interface UrlsResponse {
  success: boolean;
  data: {
    urls: Url[];
    totalCount: number;
    limit: number;
  };
}

export interface CreateUrlResponse {
  success: boolean;
  message: string;
  data: Url;
}

// Redux State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UrlState {
  urls: Url[];
  totalCount: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

// API Error Type
export interface ApiError {
  success: boolean;
  message: string;
}