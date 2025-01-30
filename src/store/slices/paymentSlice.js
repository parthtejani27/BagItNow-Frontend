// src/store/slices/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const initialState = {
  paymentMethods: [],
  defaultPaymentMethod: null,
  loading: false,
  error: null,
};

export const saveCard = createAsyncThunk(
  "payment/saveCard",
  async ({ paymentMethodId, nickname }) => {
    const response = await api.post("/payments/save-card", {
      paymentMethodId,
      nickname,
    });
    return response.data;
  }
);

export const getPaymentMethods = createAsyncThunk(
  "payment/getPaymentMethods",
  async () => {
    const response = await api.get("/payments/methods");
    return response.data;
  }
);

export const setDefaultPaymentMethod = createAsyncThunk(
  "payment/setDefault",
  async (paymentMethodId) => {
    const response = await api.post("/payments/set-default", {
      paymentMethodId,
    });
    return response.data;
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save Card
      .addCase(saveCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCard.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods.push(action.payload.data);
      })
      .addCase(saveCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Get Payment Methods
      .addCase(getPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload.data.paymentMethods;
        state.defaultPaymentMethod = action.payload.data.defaultPaymentMethod;
      })
      .addCase(getPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Set Default Payment Method
      .addCase(setDefaultPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.defaultPaymentMethod = action.payload.data.paymentMethod;
      })
      .addCase(setDefaultPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = paymentSlice.actions;

export const selectPaymentMethods = (state) => state.payment.paymentMethods;

export default paymentSlice.reducer;
