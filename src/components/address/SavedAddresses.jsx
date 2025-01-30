import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit2, MapPin, Check } from "lucide-react";
import {
  selectAddresses,
  selectDefaultAddress,
  setDefaultAddress,
} from "../../store/slices/addressSlice";

const SavedAddresses = ({ onEdit, onAddNew }) => {
  const dispatch = useDispatch();
  const addresses = useSelector(selectAddresses);
  const defaultAddress = useSelector(selectDefaultAddress);

  const handleDefaultAddressChange = (address) => {
    dispatch(setDefaultAddress(address._id));
  };

  if (!addresses?.length) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-theme-primary mb-4">
          Saved Addresses
        </h3>
        <div className="p-6 bg-theme-secondary rounded-lg text-center">
          <div className="flex justify-center mb-3">
            <MapPin className="w-8 h-8 text-theme-tertiary" />
          </div>
          <p className="text-theme-primary font-semibold mb-2">
            No saved addresses yet
          </p>
          <p className="text-theme-tertiary text-sm mb-4">
            Save addresses to make checkout faster
          </p>
          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-accent-primary text-accent-secondary rounded-lg hover:opacity-90 transition-opacity"
          >
            Add New Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-theme-primary">
          Saved Addresses
        </h3>
      </div>
      <div className="space-y-4">
        {addresses.map((address, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 rounded-lg shadow-sm border transition-all cursor-pointer ${
              address._id === defaultAddress?._id
                ? "border-accent-primary bg-theme-tertiary"
                : "border-border-secondary hover:border-accent-primary"
            }`}
            onClick={() => handleDefaultAddressChange(address)}
          >
            {/* Address Details */}
            <div>
              <p className="text-theme-primary font-semibold">
                {address.streetNumber} {address.streetName}
              </p>
              <p className="text-sm text-theme-secondary">
                {address.city}, {address.state} {address.zipcode}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Edit Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(address);
                }}
                className="p-2 bg-theme-secondary rounded-full hover:bg-theme-tertiary transition-colors"
              >
                <Edit2 className="w-5 h-5 text-theme-primary" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedAddresses;
