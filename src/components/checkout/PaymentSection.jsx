import React from "react";
import { CreditCard } from "lucide-react";

const PaymentSection = ({ selected, onSelect }) => (
  <div>
    <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
      <CreditCard className="w-5 h-5" />
      <span>Payment Method</span>
    </h3>

    {selected ? (
      <div className="flex justify-between items-center p-4 border border-theme-primary rounded-lg">
        <div>
          <p className="font-medium text-theme-primary">{selected.type}</p>
          <p className="text-sm text-theme-secondary">{selected.details}</p>
        </div>
        <button
          className="text-sm text-theme-tertiary hover:text-theme-secondary transition-colors"
          onClick={() => onSelect(null)}
        >
          Change
        </button>
      </div>
    ) : (
      <button
        className="btn btn-primary w-full"
        onClick={() => onSelect({ type: "Visa", details: "**** 1234" })}
      >
        Add Payment Method
      </button>
    )}
  </div>
);

export default PaymentSection;
