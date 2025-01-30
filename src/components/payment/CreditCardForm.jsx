import React, { useState } from "react";
import { X } from "lucide-react";

const CreditCardForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
    country: "Canada",
    zipCode: "",
    nickname: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      formattedValue =
        value
          .replace(/\s/g, "")
          .match(/.{1,4}/g)
          ?.join(" ") || "";
      if (formattedValue.length > 19) return; // 16 digits + 3 spaces
    }

    // Format expiry date MM/YY
    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 2) {
        formattedValue =
          formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    // Limit security code to 4 digits
    if (name === "securityCode" && value.length > 4) return;

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-theme-primary w-full max-w-md mx-4 rounded-2xl shadow-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-theme-primary">
              Add credit or debit card
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-theme-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-theme-primary" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-theme-primary mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 bg-theme-secondary text-theme-primary rounded-lg 
                border border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-secondary"
                required
              />
            </div>

            {/* Expiry Date and Security Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-theme-primary mb-2">
                  Exp. Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-theme-secondary text-theme-primary rounded-lg 
                  border border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-secondary"
                  required
                />
              </div>
              <div>
                <label className="block text-theme-primary mb-2">
                  Security Code
                </label>
                <input
                  type="password"
                  name="securityCode"
                  value={formData.securityCode}
                  onChange={handleChange}
                  placeholder="***"
                  maxLength="4"
                  className="w-full px-4 py-3 bg-theme-secondary text-theme-primary rounded-lg 
                  border border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-secondary"
                  required
                />
              </div>
            </div>

            {/* Country Dropdown */}
            <div>
              <label className="block text-theme-primary mb-2">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-theme-secondary text-theme-primary rounded-lg 
                border border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-secondary"
                required
              >
                <option value="Canada">Canada</option>
                <option value="United States">United States</option>
              </select>
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-theme-primary mb-2">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="P7B 4Y7"
                className="w-full px-4 py-3 bg-theme-secondary text-theme-primary rounded-lg 
                border border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-secondary"
                required
              />
            </div>

            {/* Nickname (Optional) */}
            <div>
              <label className="block text-theme-primary mb-2">
                Nickname (optional)
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="e.g. joint account or work card"
                className="w-full px-4 py-3 bg-theme-secondary text-theme-primary rounded-lg 
                border border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-secondary"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-black text-white rounded-lg font-semibold 
              hover:bg-gray-800 transition-colors duration-200 mt-6"
            >
              Add Card
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
