// src/components/payment/StripeCardForm.jsx
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { saveCard, getPaymentMethods } from "../../store/slices/paymentSlice";
import { SelectStripeCustomerId } from "../../store/slices/authSlice";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "var(--text-primary)",
      fontFamily: "Inter, system-ui, sans-serif",
      "::placeholder": {
        color: "var(--text-tertiary)",
      },
      backgroundColor: "var(--background-secondary)",
    },
    invalid: {
      color: "#ef4444",
      ":focus": {
        color: "#ef4444",
      },
    },
  },
  hidePostalCode: true,
};

const StripeCardForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const stripeCustomerId = useSelector(SelectStripeCustomerId);

  // Local state
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    zip: "",
    nickname: "",
    saveCard: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // Create payment method with Stripe
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
          billing_details: {
            address: {
              postal_code: formData.zip,
            },
          },
        });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Save the payment method using Redux
      if (formData.saveCard) {
        await dispatch(
          saveCard({
            paymentMethodId: paymentMethod.id,
            customerId: stripeCustomerId,
            nickname: formData.nickname || undefined,
            isDefault: true, // Make this card default if it's the first one
          })
        ).unwrap();

        // Refresh payment methods list
        await dispatch(getPaymentMethods(stripeCustomerId));
      }

      onSuccess(paymentMethod);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Card Change Handler
  const handleCardChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
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
              type="button"
            >
              <X className="w-6 h-6 text-theme-primary" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Element */}
            <div>
              <label className="block text-theme-primary mb-2">
                Card Number
              </label>
              <div className="p-3 bg-theme-secondary border border-theme-primary rounded-lg">
                <CardElement
                  options={CARD_ELEMENT_OPTIONS}
                  onChange={handleCardChange}
                />
              </div>
            </div>

            {/* ZIP/Postal Code */}
            <div>
              <label className="block text-theme-primary mb-2">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="P7B 4Y7"
                className="w-full px-4 py-3 bg-theme-secondary text-theme-primary rounded-lg 
                  border border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-secondary"
                required
              />
            </div>

            {/* Nickname */}
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

            {/* Save Card Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="saveCard"
                id="saveCard"
                checked={formData.saveCard}
                onChange={handleChange}
                className="h-4 w-4 text-accent-success rounded border-theme-primary focus:ring-accent-success-dark"
              />
              <label
                htmlFor="saveCard"
                className="ml-2 text-theme-primary cursor-pointer"
              >
                Save card for future payments
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing || !stripe}
              className="w-full py-4 bg-black text-white rounded-lg font-semibold 
                hover:bg-gray-800 transition-colors duration-200 mt-6 disabled:opacity-50 
                disabled:cursor-not-allowed"
            >
              {processing ? "Processing..." : "Add Card"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StripeCardForm;
