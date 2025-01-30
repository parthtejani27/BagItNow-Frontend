import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import {
  closeCart,
  removeItemFromCart,
  updateItemQuantity,
} from "../../store/slices/cartSlice";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export const CartDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.cart.isOpen);
  const cartItems = useSelector((state) => state.cart.items);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // console.log("cartItems", cartItems);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity z-40"
          onClick={() => dispatch(closeCart())}
        />
      )}

      <div
        className={`fixed top-0 right-0 w-full md:w-[500px] h-screen bg-theme-primary border-l border-theme-secondary shadow-xl flex flex-col transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-theme-secondary">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-theme-primary" />
            <h2 className="text-xl font-semibold text-theme-primary">
              Your Cart
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-2 hover:bg-theme-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-theme-primary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-theme-secondary">
              <ShoppingBag className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm">Add items to get started</p>
              <Link
                to="/"
                onClick={() => dispatch(closeCart())}
                className="mt-4 px-6 py-2 bg-theme-secondary text-theme-primary rounded-lg hover:bg-theme-tertiary transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="cart-items-container">
                {cartItems.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-theme-secondary p-4 space-y-4">
            <CartSummary />
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/"
                onClick={() => dispatch(closeCart())}
                className="flex items-center justify-center p-3 bg-theme-secondary text-theme-primary rounded-lg hover:bg-theme-tertiary transition-colors"
              >
                Add Items
              </Link>
              <Link
                to={isMobile ? "/cart" : "/checkout"}
                onClick={() => dispatch(closeCart())}
                className="flex items-center justify-center p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                {isMobile ? "View Cart" : "Checkout"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
