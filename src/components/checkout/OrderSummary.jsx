import React, { useState } from "react";
import {
  AlertCircle,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Tag,
} from "lucide-react";
import { useCartCalculations } from "../../hooks/useCartCalculations";

const OrderSummary = ({ items = [], onPromoCode }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    subTotal,
    taxes,
    deliveryFee,
    total,
    totalItems,
    isFreeDelivery,
    amountToFreeDelivery,
    formattedSubTotal,
    formattedTaxes,
    formattedDeliveryFee,
    formattedTotal,
  } = useCartCalculations(items, "delivery");

  return (
    <div className="bg-theme-primary rounded-lg shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex justify-between items-center border-b border-theme-primary"
      >
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-6 h-6 text-theme-secondary" />
          <span className="font-medium text-theme-primary">
            Cart summary ({totalItems} {totalItems === 1 ? "item" : "items"})
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-theme-secondary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-theme-secondary transform rotate-180" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Cart Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product}
                className="flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      item.productDetails?.imageUrl || "/api/placeholder/48/48"
                    }
                    alt={item.productDetails?.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <div className="font-medium text-theme-primary flex items-center">
                      <span>{item.quantity}x</span>
                      <span className="ml-1">{item.productDetails?.name}</span>
                    </div>
                    {item.note && (
                      <p className="text-sm text-theme-secondary">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
                <p className="font-medium text-theme-primary">
                  CA${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Free Delivery Progress */}
          {!isFreeDelivery && (
            <div className="p-3 bg-theme-secondary rounded-lg">
              <p className="text-sm text-theme-primary">
                Add CA${amountToFreeDelivery.toFixed(2)} more for free delivery
              </p>
              <div className="mt-2 h-2 bg-theme-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-success transition-all"
                  style={{ width: `${(subTotal / 35) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Promo Code */}
          <button
            onClick={onPromoCode}
            className="w-full p-3 border border-theme-primary rounded-lg flex justify-between items-center 
              hover:bg-theme-secondary transition-colors duration-200"
          >
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-theme-secondary" />
              <span className="text-theme-primary">Add promo code</span>
            </div>
            <ChevronRight className="w-5 h-5 text-theme-secondary" />
          </button>

          {/* Order Summary */}
          <div className="space-y-2 pt-4 border-t border-theme-primary">
            <div className="flex justify-between text-theme-secondary">
              <span>Subtotal</span>
              <span>CA${formattedSubTotal}</span>
            </div>
            <div className="flex justify-between text-theme-secondary">
              <div className="flex items-center space-x-1">
                <span>Delivery Fee</span>
                <AlertCircle className="w-4 h-4" />
              </div>
              <span>
                {isFreeDelivery ? "FREE" : `CA$${formattedDeliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-theme-secondary">
              <div className="flex items-center space-x-1">
                <span>Taxes & Other Fees</span>
                <AlertCircle className="w-4 h-4" />
              </div>
              <span>CA${formattedTaxes}</span>
            </div>
            <div className="flex justify-between font-semibold text-theme-primary pt-2 border-t border-theme-primary">
              <span>Total</span>
              <span>CA${formattedTotal}</span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-theme-secondary mt-4">
            Items Priced by Weight: Certain items in your basket may be priced
            by weight. The final weight of some goods may vary marginally from
            the weight you ordered and the price may change to reflect the final
            weight.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
