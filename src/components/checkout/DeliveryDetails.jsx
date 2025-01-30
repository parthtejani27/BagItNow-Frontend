import React from "react";
import { AlertCircle } from "lucide-react";

const DeliveryDetails = ({ address, onEdit }) => {
  return (
    <div className="p-6 bg-theme-primary rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold text-theme-primary">
          Delivery details
        </h2>
      </div>

      <div className="space-y-4">
        {/* Address Section */}
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <svg
                className="w-5 h-5 text-theme-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-theme-primary">
                {address.streetNumber + " " + address.streetName}
              </p>
              <p className="text-theme-secondary">
                {address.city}, {address.state} {address.zipcode}
              </p>
            </div>
          </div>
          <button
            onClick={onEdit.address}
            className="px-4 py-2 text-sm text-theme-secondary hover:bg-theme-secondary rounded-full transition-colors duration-200"
          >
            Edit
          </button>
        </div>

        {/* Delivery Instructions */}
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <svg
                className="w-5 h-5 text-theme-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-theme-primary">
                {address.dropoffOption}
              </p>
              {address.deliveryInstructions ? (
                <p className="text-theme-secondary">
                  {address.deliveryInstructions}
                </p>
              ) : (
                <button
                  onClick={onEdit.instructions}
                  className="text-green-600 hover:text-green-700"
                >
                  Add delivery instructions
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onEdit.instructions}
            className="px-4 py-2 text-sm text-theme-secondary hover:bg-theme-secondary rounded-full transition-colors duration-200"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
