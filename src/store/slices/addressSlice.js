import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { setSelectedAddress, setSelectedTimeslot } from "./deliverySlice";
import loadGoogleMapsScript from "../../utils/loadGoogleMapsScript";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./authSlice";

const initialState = {
  addresses: [],
  defaultAddress: null,
  currentLocation: null,
  loading: false,
  error: null,
  locationLoading: false,
  locationError: null,
  searchLoading: false,
  searchError: null,
};

// Async Thunks
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/address");
      const addresses = response.data;

      // Set default and selected address if we have addresses

      if (addresses?.data?.length > 0) {
        const defaultAddress =
          addresses.data.find((addr) => addr.isDefault) || addresses[0];
        dispatch(setSelectedAddress(defaultAddress));
        // dispatch(setSelectedTimeslot(null));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch addresses"
      );
    }
  }
);

export const detectCurrentLocation = createAsyncThunk(
  "address/detectLocation",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      // Get coordinates using browser geolocation

      const { auth } = getState();
      const isAuthenticated = !!auth.token;

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      try {
        // Load Google Maps with proper async loading
        await loadGoogleMapsScript();

        const geocoder = new window.google.maps.Geocoder();
        const result = await new Promise((resolve, reject) => {
          geocoder.geocode(
            {
              location: { lat: latitude, lng: longitude },
            },
            (results, status) => {
              if (status === "OK") {
                resolve(results[0]);
              } else {
                reject(new Error("Geocoding failed"));
              }
            }
          );
        });

        const getAddressComponent = (type) => {
          const component = result.address_components.find((comp) =>
            comp.types.includes(type)
          );
          return component ? component.long_name : "";
        };

        const formattedAddress = {
          type: "Other",
          address: result.formatted_address,
          streetNumber: getAddressComponent("street_number"),
          unit: null,
          streetName: getAddressComponent("route"),
          city:
            getAddressComponent("locality") ||
            getAddressComponent("sublocality") ||
            getAddressComponent("administrative_area_level_2"),
          state: getAddressComponent("administrative_area_level_1"),
          country: getAddressComponent("country"),
          zipcode: getAddressComponent("postal_code"),
          lat: latitude,
          lng: longitude,
          additionalInfo: "",
          dropoffOption: "Leave at my door",
          deliveryInstructions: "",
          isDefault: true,
        };

        if (isAuthenticated) {
          dispatch(setSelectedAddress(formattedAddress));
          // dispatch(setSelectedTimeslot(null));
        }

        return formattedAddress;
      } catch (error) {
        // Fallback to OpenStreetMap if Google Maps fails
        console.warn("Falling back to OpenStreetMap:", error);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();

        const formattedAddress = {
          type: "Other",
          address: data.display_name,
          streetNumber: data.address.house_number || "",
          unit: null,
          streetName: data.address.road || data.address.pedestrian || "",
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          state: data.address.state || "",
          country: data.address.country || "",
          zipcode: data.address.postcode || "",
          lat: latitude,
          lng: longitude,
          additionalInfo: "",
          dropoffOption: "Leave at door",
          deliveryInstructions: "",
          isDefault: true,
        };

        if (isAuthenticated) {
          dispatch(setSelectedAddress(formattedAddress));
          // dispatch(setSelectedTimeslot(null));
        }
        return formattedAddress;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message || "Failed to detect location");
    }
  }
);

export const searchAddresses = createAsyncThunk(
  "address/search",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`/address/search?q=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to search addresses"
      );
    }
  }
);

export const addAddress = createAsyncThunk(
  "address/add",
  async (addressData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/address", addressData);
      dispatch(fetchAddresses());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add address");
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/address/${id}`, data);
      dispatch(fetchAddresses());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update address"
      );
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/address/${id}`);
      dispatch(fetchAddresses());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete address"
      );
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "address/setDefault",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.patch(`/address/${id}/default`);
      dispatch(fetchAddresses());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to set default address"
      );
    }
  }
);

export const saveGuestAddress = createAsyncThunk(
  "address/saveGuest",
  async (addressData) => {
    localStorage.setItem("guestAddress", JSON.stringify(addressData));
    return addressData;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setDefaultAddress: (state, action) => {
      state.defaultAddress = action.payload;
    },
    clearAddressError: (state) => {
      state.error = null;
      state.locationError = null;
      state.searchError = null;
    },
    resetAddressState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.data;
        // Set default address if not already selected
        if (action.payload.data.length > 0) {
          const defaultAddress = action.payload.data.find(
            (addr) => addr.isDefault
          );
          state.defaultAddress = defaultAddress || action.payload[0];
        }
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Detect Current Location
      .addCase(detectCurrentLocation.pending, (state) => {
        state.locationLoading = true;
        state.locationError = null;
      })
      .addCase(detectCurrentLocation.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.currentLocation = action.payload;
        state.addresses.push(action.payload);
        if (!state.defaultAddress) {
          state.defaultAddress = action.payload;
        }
      })
      .addCase(detectCurrentLocation.rejected, (state, action) => {
        state.locationLoading = false;
        state.locationError = action.payload;
      })

      // Search Addresses
      .addCase(searchAddresses.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchAddresses.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchAddresses.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      })

      // Add Address
      .addCase(addAddress.fulfilled, (state, action) => {})

      // Update Address
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(
          (addr) => addr._id === action.payload.data._id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload.data;
          if (state.defaultAddress?._id === action.payload._id) {
            state.defaultAddress = action.payload.data;
          }
        }
      })

      // Delete Address
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (addr) => addr.id !== action.payload
        );
        if (state.defaultAddress?.id === action.payload) {
          state.defaultAddress =
            state.defaultAddress || state.addresses[0] || null;
        }
      })

      // Set Default Address
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === action.payload.id,
        }));
        state.defaultAddress = action.payload;
      })

      // Save Guest Address
      .addCase(saveGuestAddress.fulfilled, (state, action) => {
        state.guestAddress = action.payload;
        state.defaultAddress = action.payload;
      });
  },
});

// Export actions
export const { setdefaultAddress, clearAddressError, resetAddressState } =
  addressSlice.actions;

// Selectors
export const selectAddresses = (state) => state.address.addresses;
export const selectCurrentLocation = (state) => state.address.currentLocation;
export const selectDefaultAddress = (state) => state.address.defaultAddress;
export const selectAddressLoading = (state) => state.address.loading;
export const selectLocationLoading = (state) => state.address.locationLoading;
export const selectSearchLoading = (state) => state.address.searchLoading;
export const selectAddressError = (state) => state.address.error;
export const selectLocationError = (state) => state.address.locationError;
export const selectSearchError = (state) => state.address.searchError;

export default addressSlice.reducer;
