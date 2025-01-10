import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, ChevronDown } from "lucide-react";
import {
  selectSelectedAddress,
  selectSelectedTimeslot,
  selectDeliveryType,
} from "../../store/slices/deliverySlice";
import AddressModal from "../address/AddressModal";
import { selectIsAuthenticated } from "../../store/slices/authSlice";

const LocationSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedAddress = useSelector(selectSelectedAddress);
  const selectedTimeslot = useSelector(selectSelectedTimeslot);
  const deliveryType = useSelector(selectDeliveryType);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const formatDeliveryTime = () => {
    if (["standard", "priority"].includes(selectedTimeslot)) {
      return "Deliver now";
    } else {
      return new Date(selectedTimeslot.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 hover:bg-theme-secondary 
          rounded-lg transition-colors"
      >
        <MapPin className="w-5 h-5 text-theme-primary" />
        <div className="flex flex-col items-start">
          <span className="text-sm text-theme-primary line-clamp-1">
            {selectedAddress
              ? `${selectedAddress.streetNumber} ${selectedAddress.streetName}`
              : deliveryType === "delivery"
              ? "Select delivery address"
              : "Select pickup location"}
          </span>
          <span className="text-xs text-theme-tertiary">
            {formatDeliveryTime()}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-theme-tertiary" />
      </button>

      {isModalOpen && (
        <AddressModal
          onClose={() => setIsModalOpen(false)}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};

export default LocationSelector;
