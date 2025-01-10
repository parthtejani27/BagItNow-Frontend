// components/layout/DeliveryToggle.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDeliveryMode } from "../../store/slices/appSlice";

const DeliveryToggle = () => {
  const dispatch = useDispatch();
  const deliveryMode = useSelector((state) => state.app.deliveryMode);

  return (
    <div
      className="hidden md:flex items-center p-1 
      bg-theme-secondary
      rounded-full relative transition-all"
    >
      {/* Sliding Background */}
      <div
        className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] 
          bg-[var(--accent-primary)]
          rounded-full shadow-sm
          transition-transform duration-200 
          ${
            deliveryMode === "pickup"
              ? "translate-x-[calc(100%+4px)]"
              : "translate-x-[4px]"
          }`}
      />

      {/* Buttons */}
      <button
        onClick={() => dispatch(setDeliveryMode("delivery"))}
        className={`px-4 py-2 rounded-full text-sm font-medium 
          transition-colors duration-200 relative z-10 
          ${
            deliveryMode === "delivery"
              ? "text-[var(--background-primary)]"
              : "text-theme-tertiary hover:text-theme-secondary"
          }`}
      >
        Delivery
      </button>
      <button
        onClick={() => dispatch(setDeliveryMode("pickup"))}
        className={`px-4 py-2 rounded-full text-sm font-medium 
          transition-colors duration-200 relative z-10 
          ${
            deliveryMode === "pickup"
              ? "text-[var(--background-primary)]"
              : "text-theme-tertiary hover:text-theme-secondary"
          }`}
      >
        Pickup
      </button>
    </div>
  );
};

export default DeliveryToggle;
