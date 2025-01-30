import { useMemo } from "react";

const TAX_RATE = 0.13; // 13% tax rate
const FREE_DELIVERY_THRESHOLD = 35; // Free delivery over $35
const BASE_DELIVERY_FEE = 4.99; // Base delivery fee

export const useCartCalculations = (items = [], deliveryType = "delivery") => {
  return useMemo(() => {
    // Calculate subtotal
    const subTotal = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Calculate taxes
    const taxes = subTotal * TAX_RATE;

    // Calculate delivery fee
    let deliveryFee = 0;
    if (deliveryType === "delivery") {
      deliveryFee = subTotal >= FREE_DELIVERY_THRESHOLD ? 0 : BASE_DELIVERY_FEE;
    }

    // Calculate total
    const total = subTotal + taxes + deliveryFee;

    // Calculate total items
    const totalItems = items.reduce((count, item) => count + item.quantity, 0);

    return {
      subTotal,
      taxes,
      deliveryFee,
      total,
      totalItems,
      isFreeDelivery: subTotal >= FREE_DELIVERY_THRESHOLD,
      amountToFreeDelivery: FREE_DELIVERY_THRESHOLD - subTotal,
      formattedSubTotal: subTotal.toFixed(2),
      formattedTaxes: taxes.toFixed(2),
      formattedDeliveryFee: deliveryFee.toFixed(2),
      formattedTotal: total.toFixed(2),
    };
  }, [items, deliveryType]);
};
