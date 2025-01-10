// src/store/slices/checkoutSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const createOrder = createAsyncThunk(
  "checkout/createOrder",
  async (orderData, { getState }) => {
    const response = await api.post("/orders", {
      address: orderData.address,
      delivery: {
        option: orderData.deliveryOption,
        instructions: orderData.address.deliveryInstructions,
      },
      timeslot: orderData.timeslot,
      payment: { method: "card" },
    });
    return response.data.data;
  }
);

const initialState = {
  currentOrder: null,
  loading: false,
  error: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    clearCheckout: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCheckout } = checkoutSlice.actions;
export const selectCurrentOrder = (state) => state.checkout.currentOrder;
export const selectCheckoutLoading = (state) => state.checkout.loading;
export const selectCheckoutError = (state) => state.checkout.error;

export default checkoutSlice.reducer;
