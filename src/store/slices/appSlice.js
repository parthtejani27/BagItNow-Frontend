import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deliveryMode: "delivery", // 'delivery' or 'pickup'
  darkMode: localStorage.getItem("darkMode") === "true" || false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setDeliveryMode: (state, action) => {
      state.deliveryMode = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode);
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem("darkMode", action.payload);
    },
  },
});

// Selectors
export const selectDeliveryMode = (state) => state.app.deliveryMode;
export const selectDarkMode = (state) => state.app.darkMode;

export const { setDeliveryMode, toggleDarkMode, setDarkMode } =
  appSlice.actions;
export default appSlice.reducer;
