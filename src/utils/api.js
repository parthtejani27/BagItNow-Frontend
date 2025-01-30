import axios from "axios";
import config from "../utils/config";
// import {
//   logout,
//   refreshTokenFailed,
//   refreshTokenStart,
//   refreshTokenSuccess,
// } from "../store/slices/authSlice";

let store; // Will be initialized after store creation

export const injectStore = (_store) => {
  store = _store;
};

const api = axios.create({
  baseURL: config.api.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

if (config.app.enableLogging) {
  api.interceptors.request.use((request) => {
    // console.log("API Request:", request);
    return request;
  });
}

api.interceptors.request.use(
  (config) => {
    if (store) {
      const token = store.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!store) return Promise.reject(error);

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!store.getState().auth.refreshToken) {
      store.dispatch({ type: "auth/logout" });
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const result = await store
        .dispatch({
          type: "auth/refreshToken",
          payload: undefined,
        })
        .unwrap();

      const newToken = result.token;
      isRefreshing = false;
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      processQueue(refreshError, null);
      store.dispatch({ type: "auth/logout" });
      return Promise.reject(refreshError);
    }
  }
);
export default api;
