import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api"; // Assuming your axios instance is in this file

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  promotionalProducts: [],
  filters: {
    searchTerm: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "-createdAt",
    page: 1,
    limit: 10,
  },
  loading: false,
  error: null,
  totalPages: 1,
  totalProducts: 0,
  lastUpdated: null,
  selectedCategory: "", // Track the selected category
};

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/products?${query}`); // Make the API call with the configured axios instance
      return response.data; // Returning response data directly
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Error handling
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data; // Returning response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPromotionalProducts = createAsyncThunk(
  "product/fetchPromotionalProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products?isPromotional=true`);
      return response.data; // Returning response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Redux slice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
      state.filters.page = 1; // Reset to first page on search term change
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filters.page = 1;
      localStorage.setItem("selectedCategory", action.payload);
    },
    setPriceRange: (state, action) => {
      const { min, max } = action.payload;
      state.filters.minPrice = min;
      state.filters.maxPrice = max;
      state.filters.page = 1;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = { ...initialState.filters, limit: state.filters.limit };
      state.selectedCategory = "";
      localStorage.removeItem("selectedCategory");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.totalPages = 1;
        state.totalProducts = 8;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.data;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch promotional products
      .addCase(fetchPromotionalProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromotionalProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.promotionalProducts = action.payload;
      })
      .addCase(fetchPromotionalProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectProducts = (state) => state.product.products;
export const selectPromotionalProducts = (state) =>
  state.product.promotionalProducts;
export const selectCurrentProduct = (state) => state.product.currentProduct;
export const selectCategories = (state) => state.product.categories;
export const selectFilters = (state) => state.product.filters;
export const selectLoading = (state) => state.product.loading;
export const selectError = (state) => state.product.error;
export const selectTotalPages = (state) => state.product.totalPages;
export const selectTotalProducts = (state) => state.product.totalProducts;
export const selectLastUpdated = (state) => state.product.lastUpdated;

// Actions
export const {
  setSearchTerm,
  setCategory,
  setPriceRange,
  setSortBy,
  setPage,
  resetFilters,
  clearError,
} = productSlice.actions;

// Reducer export
export default productSlice.reducer;
