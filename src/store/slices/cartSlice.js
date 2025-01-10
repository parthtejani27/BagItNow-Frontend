import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api"; // Assuming your axios instance is in this file

// Initial state
const initialState = {
  items: [],
  total: 0,
  totalItems: 0,
  subTotal: 0,
  taxes: 0,
  deliveryFee: 0,
  loading: false,
  error: null,
  status: "idle", // Status for tracking loading, success, and failure
};

// Async thunks for API calls
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (item, { rejectWithValue }) => {
    console.log(item);
    try {
      const response = await api.post("/cart/items", {
        productId: item.id,
        quantity: item.quantity,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Error handling
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/items/${productId}`);

      return response.data.data; // Assuming the data is in response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.patch("/cart/items", {
        productId,
        quantity,
      });

      return response.data.data; // Assuming the data is in response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/cart/clear");
      return response.data.data; // Assuming the data is in response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");
      // Assuming there's an endpoint to fetch the cart
      return response.data.data; // Assuming the data is in response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Error handling
    }
  }
);

// Redux slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateDeliveryFee: (state, action) => {
      state.deliveryFee = action.payload;
      state.total = state.subTotal + state.taxes + state.deliveryFee;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add item to cart
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subTotal = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove item from cart
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subTotal = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update item quantity in cart
      .addCase(updateItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subTotal = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subTotal = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartSubTotal = (state) => state.cart.subTotal;
export const selectCartTaxes = (state) => state.cart.taxes;
export const selectCartDeliveryFee = (state) => state.cart.deliveryFee;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

// Actions
export const { openCart, closeCart, clearError, updateDeliveryFee } =
  cartSlice.actions;

// Reducer export
export default cartSlice.reducer;
