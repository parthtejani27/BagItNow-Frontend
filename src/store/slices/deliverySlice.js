import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import moment from "moment";

const initialState = {
  selectedAddress: null,
  selectedTimeslot: "priority",
  selectedDate: moment().format("YYYY-MM-DD"),
  availableTimeslots: [],
  deliveryType: "delivery", // 'delivery' or 'pickup'
  loading: false,
  error: null,
};

// Fetch available timeslots for a date
export const fetchTimeslots = createAsyncThunk(
  "delivery/fetchTimeslots",
  async (date) => {
    const response = await api.get("/timeslots/available", {
      params: { date },
    });
    return response.data;
  }
);

// Reserve a timeslot
export const reserveTimeslot = createAsyncThunk(
  "delivery/reserveTimeslot",
  async (timeslotData) => {
    const { slotId, orderId } = timeslotData;
    const response = await api.post(`/timeslots/${slotId}/reserve`, {
      orderId,
    });
    return response.data;
  }
);

// Release/cancel a timeslot reservation
export const releaseTimeslot = createAsyncThunk(
  "delivery/releaseTimeslot",
  async (timeslotData) => {
    const { slotId, orderId } = timeslotData;
    const response = await api.post(`/timeslots/${slotId}/release`, {
      orderId,
    });
    return response.data;
  }
);

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    setDeliveryType: (state, action) => {
      state.deliveryType = action.payload;
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setSelectedTimeslot: (state, action) => {
      state.selectedTimeslot = action.payload;
    },
    clearDeliverySettings: (state) => {
      return {
        ...initialState,
        selectedDate: moment().format("YYYY-MM-DD"),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Timeslots
      .addCase(fetchTimeslots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeslots.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.availableTimeslots = action.payload.data;
      })
      .addCase(fetchTimeslots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Reserve Timeslot
      .addCase(reserveTimeslot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reserveTimeslot.fulfilled, (state, action) => {
        state.loading = false;
        // Update the selected timeslot with the reserved one
        const slot = action.payload.data;
        state.selectedTimeslot = `${moment(slot.startTime).format(
          "h:mm A"
        )} - ${moment(slot.endTime).format("h:mm A")}`;
      })
      .addCase(reserveTimeslot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Release Timeslot
      .addCase(releaseTimeslot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(releaseTimeslot.fulfilled, (state) => {
        state.loading = false;
        state.selectedTimeslot = "priority";
      })
      .addCase(releaseTimeslot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions
export const {
  setDeliveryType,
  setSelectedAddress,
  setSelectedTimeslot,
  setSelectedDate,
  clearDeliverySettings,
} = deliverySlice.actions;

// Selectors
export const selectDeliveryType = (state) => state.delivery.deliveryType;
export const selectSelectedAddress = (state) => state.delivery.selectedAddress;
export const selectSelectedTimeslot = (state) =>
  state.delivery.selectedTimeslot;
export const selectSelectedDate = (state) => state.delivery.selectedDate;
export const selectAvailableTimeslots = (state) =>
  state.delivery.availableTimeslots;
export const selectDeliveryLoading = (state) => state.delivery.loading;
export const selectDeliveryError = (state) => state.delivery.error;

export default deliverySlice.reducer;
