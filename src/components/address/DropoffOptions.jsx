import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const DropoffOptions = ({
  address,
  currentOption = "Meet at my door",
  onClose,
  onUpdate,
}) => {
  const [selected, setSelected] = useState(currentOption);
  const [instructions, setInstructions] = useState("");
  const [showHandOptions, setShowHandOptions] = useState(true);

  const handOptions = [
    { id: "Hand it to me", label: "Hand it to me" },
    { id: "Meet outside", label: "Meet outside" },
    { id: "Meet in the lobby", label: "Meet in the lobby" },
  ];

  const leaveOptions = [
    { id: "Leave at my door", label: "Leave at my door" },
    { id: "Leave at building reception", label: "Leave at building reception" },
  ];

  const handleUpdate = () => {
    onUpdate({
      dropoffOption: selected,
      deliveryInstructions: instructions,
    });
  };

  useEffect(() => {
    setSelected(currentOption);
    // Check if currentOption is in leaveOptions
    const isLeaveOption = leaveOptions.some(
      (option) => option.label === currentOption
    );
    setShowHandOptions(!isLeaveOption);
  }, [currentOption]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-14">
      <div className="bg-theme-primary w-full max-w-md mx-4 rounded-2xl shadow-lg">
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-2xl font-bold text-theme-primary">
                Dropoff options
              </h2>
              <p className="text-sm text-theme-tertiary mt-1">
                Deliver to {address?.streetNumber} {address?.streetName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-theme-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-theme-primary" />
            </button>
          </div>

          {/* Hand it to me section */}
          <div
            className={`rounded-lg border-2 bg-theme-primary ${
              showHandOptions ? "border-theme-primary" : "bg-theme-secondary"
            }`}
          >
            <div
              className="p-4 flex items-center gap-3 cursor-pointer"
              onClick={() => {
                setShowHandOptions(true);
                setSelected("Meet at my door");
              }}
            >
              <span className="font-medium text-theme-primary">
                Hand it to me
              </span>
            </div>
            {showHandOptions && (
              <div className="p-4 pt-0">
                {handOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 rounded-lg flex items-center justify-between cursor-pointer
                      ${
                        selected === option.label
                          ? "bg-theme-secondary border-2 border-theme-primary"
                          : "bg-theme-secondary/50 hover:bg-theme-secondary transition-colors"
                      }`}
                    onClick={() => setSelected(option.label)}
                  >
                    <span>{option.label}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 border-theme-primary flex items-center justify-center
                      ${selected === option.label ? "bg-black" : "bg-white"}`}
                    >
                      {selected === option.label && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leave at location section */}
          <div
            className={`mt-6 rounded-lg border-2  bg-theme-primary ${
              !showHandOptions
                ? "border-theme-primary "
                : "border-theme-secondary"
            }`}
          >
            <div
              className="p-4 flex items-center gap-3 cursor-pointer"
              onClick={() => {
                setShowHandOptions(false);
                setSelected("Leave at my door");
              }}
            >
              <span className="font-medium text-theme-primary">
                Leave at location
              </span>
            </div>
            {!showHandOptions && (
              <div className="p-4 pt-0">
                {leaveOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 rounded-lg flex items-center justify-between cursor-pointer
                      ${
                        selected === option.label
                          ? "bg-theme-secondary border-2 border-theme-primary"
                          : "bg-theme-secondary/50 hover:bg-theme-secondary transition-colors"
                      }`}
                    onClick={() => setSelected(option.label)}
                  >
                    <span>{option.label}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 border-theme-primary flex items-center justify-center
                      ${selected === option.label ? "bg-black" : "bg-white"}`}
                    >
                      {selected === option.label && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-theme-primary mb-2">
              Instructions for delivery person
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Example: Please knock instead of using the doorbell"
              rows="2"
              className="w-full p-3 bg-gray-100 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            ></textarea>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 text-theme-primary font-medium hover:text-theme-tertiary transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleUpdate}
              className="px-8 py-2.5 bg-black text-white rounded-full 
                hover:opacity-90 transition-opacity font-medium"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropoffOptions;
