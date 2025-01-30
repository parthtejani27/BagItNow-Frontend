import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Initial state
const initialState = {
  categories: [], // List of categories
  subcategories: [], // List of subcategories
  selectedCategory: null, // Selected category
  selectedSubcategory: null, // Selected subcategory
  loading: false, // Loading state for async calls
  error: null, // Error state
};

// Async Thunks
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/categories");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to load categories"
      );
    }
  }
);

export const fetchSubcategories = createAsyncThunk(
  "category/fetchSubcategories",
  async (categoryId, thunkAPI) => {
    try {
      const response = await api.get(`/categories/${categoryId}/subcategories`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to load subcategories"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.subcategories = []; // Reset subcategories when a new category is selected
    },
    setSelectedSubcategory: (state, action) => {
      state.selectedSubcategory = action.payload;
    },
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Subcategories
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload.data;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  setSelectedCategory,
  setSelectedSubcategory,
  clearCategoryError,
} = categorySlice.actions;

// Selectors
export const selectCategories = (state) => state.category.categories;
export const selectSubcategories = (state) => state.category.subcategories;
export const selectSelectedCategory = (state) =>
  state.category.selectedCategory;
export const selectSelectedSubcategory = (state) =>
  state.category.selectedSubcategory;
export const selectCategoryLoading = (state) => state.category.loading;
export const selectCategoryError = (state) => state.category.error;

export default categorySlice.reducer;
