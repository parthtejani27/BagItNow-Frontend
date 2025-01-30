// src/components/payment/SavedCards.jsx
import React from "react";
import { CreditCard, Plus } from "lucide-react";

const SavedCards = ({ cards, onSelect, onAddCard, selectedCardId }) => {
  const getCardIcon = (brand) => {
    // Add different card icons based on brand
    return <CreditCard className="w-6 h-6 text-theme-primary" />;
  };

  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <button
          key={card.id}
          onClick={() => onSelect(card.id)}
          className={`w-full p-4 border rounded-lg flex items-center justify-between transition-colors
            ${
              card.id === selectedCardId
                ? "border-accent-success bg-theme-secondary"
                : "border-theme-primary hover:bg-theme-secondary"
            }`}
        >
          <div className="flex items-center space-x-3">
            {getCardIcon(card.brand)}
            <div className="text-left">
              <p className="text-theme-primary font-medium">
                {card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} ••••{" "}
                {card.last4}
              </p>
              <p className="text-theme-tertiary text-sm">
                Expires {card.expiryMonth}/{card.expiryYear}
              </p>
            </div>
          </div>
          {card.isDefault && (
            <span className="text-sm text-accent-success">Default</span>
          )}
        </button>
      ))}

      <button
        onClick={onAddCard}
        className="w-full p-4 border border-theme-primary rounded-lg flex items-center space-x-3 
          hover:bg-theme-secondary transition-colors"
      >
        <Plus className="w-6 h-6 text-theme-primary" />
        <span className="text-theme-primary">Add new card</span>
      </button>
    </div>
  );
};

export default SavedCards;
