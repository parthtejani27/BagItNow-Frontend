import React from "react";
import { useDispatch } from "react-redux";
import {
  removeItemFromCart,
  updateItemQuantity,
} from "../../store/slices/cartSlice";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, item.quantity + change);
    dispatch(updateItemQuantity({ id: item.id, quantity: newQuantity }));
  };

  return (
    <div className="flex items-start space-x-4 p-4 bg-theme-secondary rounded-lg">
      <img
        src={item.productDetails.imageUrl}
        alt={item.productDetails.name}
        className="w-20 h-20 object-cover rounded-md"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-theme-primary font-medium truncate">
          {item.productDetails.name}
        </h3>
        <p className="text-theme-secondary text-sm mt-1">${item.price}</p>

        <div className="flex items-center mt-2 space-x-2">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="p-1 rounded-md hover:bg-theme-tertiary text-theme-primary transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-theme-primary">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="p-1 rounded-md hover:bg-theme-tertiary text-theme-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <button
        onClick={() => dispatch(removeItemFromCart(item.id))}
        className="p-2 text-theme-secondary hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CartItem;
