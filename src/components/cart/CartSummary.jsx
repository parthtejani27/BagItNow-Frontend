import React from "react";
import { useSelector } from "react-redux";

const CartSummary = () => {
  const { items, total } = useSelector((state) => state.cart);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-theme-secondary">
        <span>Subtotal ({itemCount} items)</span>
        <span>${total}</span>
      </div>
      <div className="flex justify-between text-sm text-theme-secondary">
        <span>Shipping</span>
        <span>Free</span>
      </div>
      <div className="h-px bg-theme-secondary" />
      <div className="flex justify-between text-lg font-semibold text-theme-primary">
        <span>Total</span>
        <span>${total}</span>
      </div>
    </div>
  );
};

export default CartSummary;
