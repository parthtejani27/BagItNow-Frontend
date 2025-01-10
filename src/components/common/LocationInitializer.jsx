import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  detectCurrentLocation,
  fetchAddresses,
} from "../../store/slices/addressSlice";
import {
  setDeliveryType,
  setSelectedAddress,
  setSelectedTimeslot,
} from "../../store/slices/deliverySlice";
import { selectIsAuthenticated } from "../../store/slices/authSlice";

const LocationInitializer = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const initializeLocation = async () => {
      if (isAuthenticated) {
        // For logged-in users, fetch their saved addresses
        await dispatch(fetchAddresses());
      } else {
        dispatch(detectCurrentLocation());
      }

      // Set default delivery type and time
      dispatch(setDeliveryType("delivery"));

      // dispatch(setSelectedTimeslot("priority"));
    };

    initializeLocation();
  }, [dispatch, isAuthenticated]);

  return null; // This is a utility component, it doesn't render anything
};

export default LocationInitializer;
