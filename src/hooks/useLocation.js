import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedAddress,
  selectCurrentLocation,
  selectGuestAddress,
  selectLocationLoading,
  selectLocationError,
  detectCurrentLocation,
  saveGuestAddress,
} from "../store/slices/addressSlice";
import { selectIsAuthenticated } from "../store/slices/authSlice";

export const useLocation = () => {
  const dispatch = useDispatch();
  const selectedAddress = useSelector(selectSelectedAddress);
  const currentLocation = useSelector(selectCurrentLocation);
  const guestAddress = useSelector(selectGuestAddress);
  const isLoading = useSelector(selectLocationLoading);
  const error = useSelector(selectLocationError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const refreshLocation = () => {
    dispatch(detectCurrentLocation());
  };

  const saveLocation = (address) => {
    if (!isAuthenticated) {
      dispatch(saveGuestAddress(address));
    }
  };

  const getCurrentAddress = () => {
    return selectedAddress || currentLocation || guestAddress;
  };

  const hasValidAddress = () => {
    const address = getCurrentAddress();
    return !!address && !!address.coordinates;
  };

  return {
    selectedAddress,
    currentLocation,
    guestAddress,
    isLoading,
    error,
    refreshLocation,
    saveLocation,
    getCurrentAddress,
    hasValidAddress,
  };
};

export default useLocation;
