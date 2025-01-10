import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, MapPin, Clock, Search } from "lucide-react";

import {
  selectSelectedAddress,
  selectSelectedTimeslot,
  setSelectedAddress,
  setSelectedTimeslot,
} from "../../store/slices/deliverySlice";
import {
  selectAddresses,
  selectDefaultAddress,
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../store/slices/addressSlice";

import AddressSearch from "./AddressSearch";
import SavedAddresses from "./SavedAddresses";
import TimePreference from "./TimePreference";
import AddressTypeSelector from "./AddressTypeSelector";
import EditAddress from "./EditAddress";
import DropoffOptions from "./DropoffOptions";
import TimeSlotSelection from "./TimeSlotSelection";

const AddressModal = ({
  onClose,
  isAuthenticated = false,
  hideTimePreference = false,
}) => {
  const dispatch = useDispatch();
  const [view, setView] = useState("MAIN");
  const [tempAddress, setTempAddress] = useState(null);
  const selectedAddress = useSelector(selectSelectedAddress);
  const selectedTime = useSelector(selectSelectedTimeslot);

  // Handle address selection from search
  const handleAddressSelect = (address) => {
    setTempAddress(address);
    setView("BUILDING_TYPE");
  };

  // Handle building type selection
  const handleBuildingTypeSelect = (type) => {
    setTempAddress({ ...tempAddress, type });
    setView("EDIT");
  };

  // Handle skip building type
  const handleSkipBuildingType = () => {
    setTempAddress({ ...tempAddress, type: "Other" });
    setView("EDIT");
  };

  // Handle edit save
  const handleEditSave = (editedAddress) => {
    console.log(editedAddress);
    // dispatch(setSelectedAddress(editedAddress));
    if ("_id" in editedAddress) {
      dispatch(updateAddress({ id: editedAddress._id, data: editedAddress }));
    } else {
      dispatch(addAddress(editedAddress));
    }
    setTempAddress(null);
    setView("MAIN");
  };

  const handletemp = (temp) => {
    setTempAddress((prev) => ({ ...prev, ...temp }));
  };

  // Handle dropoff options update
  const handleDropoffUpdate = (dropoffDetails) => {
    setTempAddress((prev) => ({ ...prev, ...dropoffDetails }));
    setView("EDIT");
  };

  const handleDelete = (id) => {
    dispatch(deleteAddress(id));
    setView("MAIN");
  };

  // Show AddressSearch if in search mode
  if (view === "SEARCH") {
    return (
      <AddressSearch
        onClose={() => setView("MAIN")}
        onSelect={handleAddressSelect}
      />
    );
  }

  // Show BuildingTypeSelector if in building type selection mode
  if (view === "BUILDING_TYPE") {
    return (
      <AddressTypeSelector
        onSelect={handleBuildingTypeSelect}
        onClose={() => setView("MAIN")}
        onSkip={handleSkipBuildingType}
      />
    );
  }

  // Show EditAddress if in edit mode
  if (view === "EDIT") {
    return (
      <EditAddress
        address={tempAddress || selectedAddress}
        onClose={() => setView("MAIN")}
        onSave={handleEditSave}
        onEditDropoff={() => setView("DROPOFF")}
        onUpdate={handletemp}
        isEdit={"_id" in tempAddress}
        onDelete={handleDelete}
      />
    );
  }

  // Show DropoffOptions if in dropoff mode
  if (view === "DROPOFF") {
    return (
      <DropoffOptions
        address={tempAddress || selectedAddress}
        currentOption={
          tempAddress?.dropoffOption || selectedAddress?.dropoffOption
        }
        onClose={() => setView("EDIT")}
        onUpdate={handleDropoffUpdate}
      />
    );
  }

  if (view === "TIMESLOTS") {
    return <TimeSlotSelection onClose={() => setView("MAIN")} />;
  }

  // Authenticated view content
  const AuthenticatedContent = () => (
    <div className="p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-theme-primary">
          Delivery details
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-theme-secondary rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-theme-primary" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search for an address"
          className="w-full pl-10 pr-4 py-3 bg-theme-secondary text-theme-primary 
            rounded-full border border-theme-primary focus:outline-none focus:ring-2"
          onClick={() => setView("SEARCH")}
          readOnly
        />
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-theme-tertiary" />
      </div>

      {/* Saved Addresses */}
      <SavedAddresses
        onEdit={(address) => {
          setTempAddress(address);
          setView("EDIT");
        }}
        onAddNew={() => setView("SEARCH")}
      />

      {/* Time Preference */}
      {!hideTimePreference && (
        <TimePreference onSchedule={() => setView("TIMESLOTS")} />
      )}
    </div>
  );

  // Non-authenticated view content
  const NonAuthenticatedContent = () => (
    <div className="p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-theme-primary">
          Delivery details
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-theme-secondary rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-theme-primary" />
        </button>
      </div>

      {/* Address Section */}
      <div className="flex items-start gap-3 mb-6">
        <MapPin className="w-6 h-6 mt-1 text-theme-primary" />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-medium text-theme-primary">
                {selectedAddress?.streetNumber}{" "}
                {selectedAddress?.streetName || "Add an address"}
              </p>
              <p className="text-theme-tertiary">
                {selectedAddress?.city
                  ? `${selectedAddress.city}, ${selectedAddress.state}`
                  : "No address selected"}
              </p>
            </div>
            <button
              onClick={() => setView("SEARCH")}
              className="ml-4 px-4 py-2 text-sm bg-theme-secondary text-theme-primary 
                rounded-full hover:bg-theme-tertiary transition-colors"
            >
              {selectedAddress ? "Change" : "Add"}
            </button>
          </div>
        </div>
      </div>

      {/* Time Section */}
      <div className="flex items-start gap-3">
        <Clock className="w-6 h-6 mt-1 text-theme-primary" />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <p className="text-lg font-medium text-theme-primary">
              {selectedTime || "Deliver now"}
            </p>
            <button
              onClick={() => dispatch(setSelectedTimeslot("SCHEDULE"))}
              className="ml-4 px-4 py-2 text-sm bg-theme-secondary text-theme-primary 
                rounded-full hover:bg-theme-tertiary transition-colors"
            >
              Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Done Button */}
      <div className="mt-6 pt-4 border-t border-theme-secondary">
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-black text-white rounded-full
            hover:opacity-90 transition-opacity font-medium text-base"
        >
          Done
        </button>
      </div>
    </div>
  );

  // Main modal wrapper
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-14">
      <div className="bg-theme-primary w-full max-w-md mx-4 rounded-2xl shadow-lg">
        {isAuthenticated ? (
          <AuthenticatedContent />
        ) : (
          <NonAuthenticatedContent />
        )}
      </div>
    </div>
  );
};

export default AddressModal;
