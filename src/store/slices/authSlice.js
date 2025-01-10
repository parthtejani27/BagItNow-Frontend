// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import api from "../../utils/api";

const initialState = {
  user: null,

  token: null,
  refreshToken: null,
  isRegistered: null,
  isVerified: false,
  currentStep: "INITIAL", // INITIAL, OTP_VERIFICATION, ADDITIONAL_INFO, PASSWORD, USER_DETAILS
  loading: false,
  error: null,
  isRefreshing: false,
  otpSent: false,
  verificationId: null,
  verifiedEmail: null,
  verifiedPhone: null,
  tempUserData: {},
  type: null,
  stripeCustomerId: null,
};

// Async Thunks
export const checkUser = createAsyncThunk(
  "auth/checkUser",
  async (emailOrPhone) => {
    const response = await api.post("/users/checkUser", emailOrPhone);
    return response.data;
  }
);

export const login = createAsyncThunk("auth/login", async (credentials) => {
  const response = await api.post("/users/login", credentials);
  return response.data;
});

export const register = createAsyncThunk("auth/register", async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
});

export const savePassword = createAsyncThunk(
  "auth/savePassword",
  async (userData) => {
    const response = await api.post("/users/savePassword", userData);
    return response.data;
  }
);

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (emailOrPhone) => {
    const response = await api.post("/users/sendOTP", emailOrPhone);
    return response.data;
  }
);

export const verifyOTP = createAsyncThunk("auth/verifyOTP", async (data) => {
  const response = await api.post("/users/verifyOTP", data);
  return response.data;
});

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState }) => {
    const state = getState();
    const response = await api.post("/users/refresh-token", { refreshToken });
    return response.data;
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async () => {
    const response = await api.get("/users/getProfile");
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (updateData) => {
    const response = await api.patch("/users/profile", updateData);
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    updateTempUserData: (state, action) => {
      state.tempUserData = { ...state.tempUserData, ...action.payload };
    },
    clearTempUserData: (state) => {
      state.tempUserData = {};
    },
    setVerifiedContact: (state, action) => {
      const { type, value } = action.payload;
      if (type === "email") state.verifiedEmail = value;
      if (type === "phone") state.verifiedPhone = value;
    },
    clearAuth: (state) => {
      return { ...initialState };
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setOtpSent: (state, action) => {
      state.otpSent = action.payload;
    },
    setVerificationId: (state, action) => {
      state.verificationId = action.payload;
    },
    setIsVerified: (state, action) => {
      state.isVerified = action.payload;
    },
    refreshTokenStart: (state) => {
      state.isRefreshing = true;
    },
    refreshTokenSuccess: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isRefreshing = false;
      state.error = null;
    },
    refreshTokenFailed: (state) => {
      state.isRefreshing = false;
      state.error = "Token refresh failed";
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(REHYDRATE, (state, action) => {
        // When the app loads, Redux Persist will try to restore the saved state
        // action.payload contains the persisted state from localStorage

        if (action.payload?.auth) {
          // Merge the persisted state with current state
          return {
            ...state, // Keep current state as base
            ...action.payload.auth, // Override with persisted values
            loading: false, // Reset loading state
            error: null, // Reset error state
          };
        }
        // If no persisted state, return current state
        return state;
      })
      // Check User
      .addCase(checkUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isRegistered = action.payload.data.isRegistered;
        state.verifiedEmail = action.payload.data.verifiedEmail;
        state.verifiedPhone = action.payload.data.verifiedPhone;
        state.verificationId = action.payload.data.verificationId;
        state.tempUserData = action.payload.data;
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationId = action.payload.data.verificationId;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //verifyOTP

      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data.isRegistered) {
          state.user = action.payload.data.user;
          state.token = action.payload.data.accessToken;
          state.refreshToken = action.payload.data.refreshToken;
          state.isRegistered = action.payload.data.user.isRegistered;
          state.tempUserData = null;
        } else {
          state.isRegistered = action.payload.data.user.isRegistered;
          state.verifiedEmail = action.payload.data.user.verifiedEmail;
          state.verifiedPhone = action.payload.data.user.verifiedPhone;
          state.tempUserData = action.payload.data.user;
          if (
            action.payload.data.user.verifiedEmail &&
            action.payload.data.user.verifiedPhone
          ) {
            state.currentStep = "PASSWORD";
          } else {
            state.currentStep = "ADDITIONAL_INFO";
          }
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //updatePassword
      .addCase(savePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStep = "USER_DETAILS";
      })
      .addCase(savePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        state.isRegistered = action.payload.data.user.isRegistered;
        state.stripeCustomerId = action.payload.data.user.stripeCustomerId;
        state.tempUserData = null;
        state.isVerified = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        state.stripeCustomerId = action.payload.data.user.stripeCustomerId;
        state.isVerified = true;
        state.isRegistered = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isRefreshing = false;
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        state.error = action.error.message;
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      //update user

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        // Update verification status if email/phone was changed
        if (action.payload.data.isEmailVerified !== undefined) {
          state.verifiedEmail = action.payload.data.isEmailVerified;
        }
        if (action.payload.data.isPhoneVerified !== undefined) {
          state.verifiedPhone = action.payload.data.isPhoneVerified;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions
export const {
  setType,
  setUser,
  setToken,
  setRefreshToken,
  setError,
  clearError,
  setOtpSent,
  setVerificationId,
  setIsVerified,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailed,
  logout,
  setCurrentStep,
  updateTempUserData,
  clearTempUserData,
  setVerifiedContact,
  clearAuth,
} = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectIsVerified = (state) => state.auth.isVerified;
export const selectIsLoading = (state) => state.auth.loading;
export const selectError = (state) => state.auth.error;
export const selectIsRefreshing = (state) => state.auth.isRefreshing;
export const selectIsRegistered = (state) => state.auth.isRegistered;
export const SelectStripeCustomerId = (state) => state.auth.stripeCustomerId;

export default authSlice.reducer;
