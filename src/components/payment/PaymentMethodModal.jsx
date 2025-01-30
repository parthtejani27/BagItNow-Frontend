import React from "react";
import { X } from "lucide-react";

const PaymentMethodModal = ({ onClose, onSelectMethod }) => {
  const paymentMethods = [
    {
      id: "google-pay",
      name: "Google Pay",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <path
            d="M21.5 11.95c0-.86-.07-1.68-.21-2.46H12v4.64h5.37a4.58 4.58 0 01-1.99 3.02v2.51h3.22c1.89-1.74 2.98-4.31 2.98-7.71z"
            fill="#4285F4"
          />
          <path
            d="M12 22c2.69 0 4.95-.89 6.6-2.41l-3.22-2.51c-.89.6-2.03.95-3.38.95-2.6 0-4.81-1.76-5.6-4.12H3.06v2.59C4.71 19.68 8.09 22 12 22z"
            fill="#34A853"
          />
          <path
            d="M6.4 13.91c-.2-.58-.31-1.21-.31-1.85 0-.64.11-1.27.31-1.85V7.62H3.06A9.996 9.996 0 002 12c0 1.61.39 3.13 1.06 4.49l3.34-2.58z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.88c1.47 0 2.79.51 3.82 1.5l2.86-2.86C16.97 2.99 14.71 2 12 2 8.09 2 4.71 4.32 3.06 7.62l3.34 2.59c.79-2.36 3-4.12 5.6-4.12z"
            fill="#EA4335"
          />
        </svg>
      ),
    },
    {
      id: "apple-pay",
      name: "Apple Pay",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.72 7.21c.85 0 2.43-.59 3.29-1.89-1.37-.08-2.89.77-3.49 1.89h.2zm.28 1.26c-1.57 0-2.87.89-2.87.89s-1.37-.83-3.29-.83c-2.73.06-5.39 2.23-5.39 6.17 0 4.79 4.32 6.47 4.32 6.47s1.37 1.17 2.87 1.17c1.68 0 2.87-1.17 2.87-1.17s2.67-1.17 4.15-4.37h.05c-.48-1.49-.11-4.81 2.78-6.11-1.37-1.55-3.97-2.22-5.49-2.22z" />
        </svg>
      ),
    },
    {
      id: "card",
      name: "Credit or debit card",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20M6 15h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-theme-primary w-full max-w-md mx-4 rounded-2xl shadow-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-theme-primary">
              Add payment method
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-theme-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-theme-primary" />
            </button>
          </div>

          {/* Payment Methods List */}
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => onSelectMethod(method.id)}
                className="w-full p-4 flex items-center justify-between bg-theme-secondary 
                  hover:bg-theme-tertiary text-theme-primary rounded-lg transition-colors"
              >
                <div className="flex items-center gap-4">
                  {method.icon}
                  <span className="text-lg">{method.name}</span>
                </div>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
