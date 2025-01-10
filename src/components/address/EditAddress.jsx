import React, { useState } from "react";
import { X, ChevronDown, Trash2 } from "lucide-react";

const EditAddress = ({
  address,
  onClose,
  onSave,
  onEditDropoff,
  onUpdate,
  isEdit,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    type: address?.type || "House",
    additionalDetails: address?.additionalInfo || "",
    deliveryInstructions: address?.deliveryInstructions || "",
    label: address?.label || "",
    dropoffOption: address?.dropoffOption || "Meet at my door",
    isDefault: true,
  });

  console.log(isEdit);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const buildingTypes = ["House", "Apartment", "Office", "Hotel", "Other"];

  const handleBuildingTypeSelect = (type) => {
    setFormData({ ...formData, type: type });
    onUpdate({ ...formData, type: type });
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    onSave({ ...address, ...formData });
  };

  const handleChange = (field, value) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    onUpdate(updatedFormData);
  };

  const handleDelete = () => {
    onDelete(address._id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-14">
      <div className="bg-theme-primary w-full max-w-md mx-4 rounded-2xl shadow-lg">
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              {isEdit ? (
                <h2 className="text-2xl font-bold text-theme-primary">
                  Edit Address
                </h2>
              ) : (
                <h2 className="text-2xl font-bold text-theme-primary">
                  New Address
                </h2>
              )}
              <p className="text-theme-tertiary text-sm mt-1">
                {address?.streetNumber} {address?.streetName}, {address?.city},{" "}
                {address?.state} {address?.zipcode}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-theme-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-theme-primary" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {/* Building Type Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Building type
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3.5 text-left bg-theme-secondary text-theme-primary rounded-lg 
                    border border-theme-primary focus:outline-none focus:ring-2 relative"
                >
                  <span>{formData.type}</span>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-primary
                      transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute z-10 w-full mt-1 bg-theme-primary rounded-lg shadow-lg 
                    border border-theme-secondary overflow-hidden"
                  >
                    {buildingTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleBuildingTypeSelect(type)}
                        className={`w-full px-4 py-3 text-left hover:bg-theme-secondary transition-colors
                          ${
                            type === formData.type ? "bg-theme-secondary" : ""
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Additional details
              </label>
              <input
                type="text"
                placeholder="e.g. House number or name"
                value={formData.additionalDetails}
                onChange={(e) =>
                  handleChange("additionalDetails", e.target.value)
                }
                className="w-full p-3.5 bg-theme-secondary text-theme-primary rounded-lg 
                  border border-theme-primary focus:outline-none focus:ring-2"
              />
            </div>

            {/* Dropoff Options */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Dropoff options
              </label>
              <button
                onClick={onEditDropoff}
                className="w-full flex items-center justify-between p-3.5 bg-theme-secondary 
                  text-theme-primary rounded-lg hover:bg-theme-tertiary transition-colors
                  border border-theme-primary"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{formData.dropoffOption}</span>
                  <span className="text-theme-tertiary text-sm">
                    More options available
                  </span>
                </div>
                <span className="text-theme-primary text-sm font-medium">
                  Edit
                </span>
              </button>
            </div>

            {/* Delivery Instructions */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Instructions for delivery person
              </label>
              <input
                type="text"
                placeholder="Example: Please knock instead of using the doorbell"
                value={formData.deliveryInstructions}
                onChange={(e) =>
                  handleChange("deliveryInstructions", e.target.value)
                }
                className="w-full p-3.5 bg-theme-secondary text-theme-primary rounded-lg 
                  border border-theme-primary focus:outline-none focus:ring-2"
              />
            </div>

            {/* Address Label */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Address label
              </label>
              <input
                type="text"
                placeholder="Add a label (e.g. school)"
                value={formData.label}
                onChange={(e) => handleChange("label", e.target.value)}
                className="w-full p-3.5 bg-theme-secondary text-theme-primary rounded-lg 
                  border border-theme-primary focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          {isEdit && (
            <div className="mt-6">
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Delete Address</span>
              </button>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-theme-secondary">
            <button
              onClick={onClose}
              className="px-4 py-2 text-theme-primary font-medium hover:text-theme-tertiary transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2.5 bg-black text-white rounded-full 
                hover:opacity-90 transition-opacity font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAddress;
