import React from "react";
import {
  X,
  Home,
  Building2,
  Briefcase,
  Hotel,
  MapPin,
  ChevronRight,
} from "lucide-react";

const AddressTypeSelector = ({ onSelect, onClose, onSkip }) => {
  const buildingTypes = [
    { id: "House", label: "House", icon: Home },
    { id: "Apartment", label: "Apartment", icon: Building2 },
    { id: "Office", label: "Office", icon: Briefcase },
    { id: "Hotel", label: "Hotel", icon: Hotel },
    { id: "Other", label: "Other", icon: MapPin },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-14">
      <div className="bg-theme-primary w-full max-w-md mx-4 rounded-2xl shadow-lg">
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-2xl font-bold text-theme-primary mb-2">
                Choose your building
              </h2>
              <p className="text-theme-tertiary">
                Let us know your building type for more accurate deliveries
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-theme-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-theme-primary" />
            </button>
          </div>

          {/* Building Types List */}
          <div className="mt-6 space-y-2">
            {buildingTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => onSelect(type.id)}
                  className="w-full flex items-center justify-between p-4 bg-theme-secondary 
                    rounded-lg hover:bg-theme-tertiary transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-theme-primary" />
                    <span className="font-medium text-theme-primary">
                      {type.label}
                    </span>
                  </div>
                  <ChevronRight
                    className="w-5 h-5 text-theme-tertiary 
                    group-hover:text-theme-primary transition-colors"
                  />
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-4 mt-6 pt-4 border-t border-theme-secondary">
            <button
              onClick={onClose}
              className="px-4 py-2 text-theme-primary font-medium hover:bg-theme-secondary rounded-lg"
            >
              Back
            </button>
            <button
              onClick={onSkip}
              className="px-4 py-2 text-theme-primary font-medium hover:bg-theme-secondary rounded-lg"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressTypeSelector;
