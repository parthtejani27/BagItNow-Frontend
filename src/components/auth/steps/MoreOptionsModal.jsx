import React from "react";
import { X } from "lucide-react";
import { useClickOutside } from "../../../hooks/useClickOutside";

const MoreOptionsModal = ({ isOpen, onClose, onOptionSelect, loginType }) => {
  const modalRef = useClickOutside(onClose);
  if (!isOpen) return null;

  let options = [];
  if (loginType === "email") {
    options = [
      { id: "phone", label: "Get OTP on Mobile" },
      { id: "password", label: "Password" },
    ];
  } else if (loginType === "phone") {
    options = [
      { id: "email", icon: "📱", label: "Get OTP on Email" },
      { id: "password", icon: "🔒", label: "Password" },
    ];
  } else {
    options = [
      { id: "email", icon: "📱", label: "Get OTP on Email" },
      { id: "phone", label: "Get OTP on Mobile" },
    ];
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-3xl w-full max-w-md mx-4 overflow-hidden"
        ref={modalRef}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">More options</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold mb-4 ">
            Choose another way to verify
          </h3>

          {/* Options List */}
          <div className="space-y-2">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onOptionSelect(option.id);
                  onClose();
                }}
                className="w-full flex items-center p-4 font-semibold hover:bg-gray-50 rounded-xl transition-colors"
              >
                <span className="text-base">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreOptionsModal;
