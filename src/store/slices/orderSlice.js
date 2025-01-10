import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchOrderDetails = createAsyncThunk(
  "order/fetchDetails",
  async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  }
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (params = {}) => {
    const response = await api.get("/orders", { params });
    return response.data;
  }
);

export const cancelOrder = createAsyncThunk("order/cancel", async (orderId) => {
  const response = await api.post(`/orders/${orderId}/cancel`);
  return response.data.data;
});

const initialState = {
  currentOrder: null,
  userOrders: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrderState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload.data.orders;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
        state.userOrders = state.userOrders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Selectors
export const selectOrderDetails = (state) => state.order.currentOrder;
export const selectUserOrders = (state) => state.order.userOrders;
export const selectOrderPagination = (state) => state.order.pagination;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;

export const { clearOrderError, resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
