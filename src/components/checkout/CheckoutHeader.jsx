import { ArrowLeft, Lock } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CheckoutHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-theme-primary border-b border-theme-primary">
      <div className="container-custom h-16 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-theme-primary hover:text-theme-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back</span>
        </button>

        <h1 className="text-xl font-semibold text-theme-primary">Checkout</h1>

        <div className="flex items-center text-theme-secondary">
          <Lock className="w-4 h-4 mr-2" />
          <span className="text-sm">Secure Checkout</span>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
