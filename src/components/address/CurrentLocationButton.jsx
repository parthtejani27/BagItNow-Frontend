import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Loader2 } from "lucide-react";
import {
  detectCurrentLocation,
  selectLocationLoading,
  selectLocationError,
} from "../../store/slices/addressSlice";
import { setSelectedAddress } from "../../store/slices/deliverySlice";

const CurrentLocationButton = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const isLocating = useSelector(selectLocationLoading);
  const locationError = useSelector(selectLocationError);

  const handleClick = async () => {
    try {
      const address = await dispatch(detectCurrentLocation()).unwrap();
      dispatch(setSelectedAddress(address));
      if (onSuccess) {
        onSuccess(address);
      }
    } catch (error) {
      console.error("Failed to detect location:", error);
    }
  };

  return (
    <div className="mt-4">
      <button className="w-full py-3.5 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-colors font-medium text-base">
        Use current location
      </button>
    </div>
  );
};

export default CurrentLocationButton;
