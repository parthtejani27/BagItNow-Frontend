import React from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentProduct } from "../../store/slices/productSlice";
import {
  addItemToCart,
  selectCartItems,
  updateItemQuantity,
} from "../../store/slices/cartSlice";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    navigate(`/products/${product._id}`);
  };

  const cartItems = useSelector(selectCartItems);

  // Check if the product is in the cart
  const cartItem = cartItems.find((item) => item.product === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addItemToCart({ id: product._id, quantity: 1 }));
  };

  // Handle quantity increase
  const handleIncrease = (e) => {
    e.stopPropagation();
    console.log("a");
    dispatch(
      updateItemQuantity({ productId: product._id, quantity: quantity + 1 })
    );
  };

  // Handle quantity decrease
  const handleDecrease = (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      dispatch(
        updateItemQuantity({ productId: product._id, quantity: quantity - 1 })
      );
    } else {
      dispatch(updateItemQuantity({ productId: product._id, quantity: 0 }));
    }
  };

  // Helper function to render star rating
  const renderStars = (rating = 0) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div
      className="relative bg-theme-primary dark:bg-theme-secondary rounded-lg shadow-sm border border-theme-primary dark:border-theme-secondary p-4 transition-transform hover:shadow-md h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Product Image Container */}
      {/* Product Image Container */}
      <div className="relative w-full h-[250px] mb-4 group overflow-hidden rounded-lg">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition-colors bg-theme-primary dark:bg-theme-secondary rounded-full p-1.5">
          <Heart className="w-5 h-5" />
        </button>

        {/* Add to Cart Button Overlay */}
        <div className="absolute bottom-2 left-2">
          {quantity > 0 ? (
            <div className="flex items-center gap-3 bg-green-500 text-white rounded-full shadow-md px-4 py-2">
              {/* Decrease Button */}
              <button
                onClick={handleDecrease}
                className="rounded-full w-8 h-8 flex items-center justify-center  hover:bg-green-600 transition-all shadow-sm"
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* Quantity Display */}
              <span className="text-base font-bold">{quantity}</span>

              {/* Increase Button */}
              <button
                onClick={handleIncrease}
                className="rounded-full w-8 h-8 flex items-center justify-center  hover:bg-green-600 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              className="bg-green-500 text-white rounded-full py-2 px-4 flex items-center gap-2 shadow-lg transition-all"
              onClick={handleAddToCart}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow justify-between space-y-2">
        {/* Title */}
        <h3 className="text-theme-primary dark:text-theme-secondary font-medium line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-theme-primary dark:text-theme-secondary">
            ${product.price}
          </span>
          {product.unitPrice && (
            <span className="text-sm text-theme-secondary dark:text-theme-tertiary">
              ${product.unitPrice}/100g
            </span>
          )}
        </div>

        {/* Weight/Size */}
        <p className="text-sm text-theme-secondary dark:text-theme-tertiary">
          {product.weight}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 min-h-[1.25rem]">
          <div className="flex">{renderStars(product.rating || 0)}</div>
          <span className="text-sm text-theme-secondary dark:text-theme-tertiary">
            ({product.reviews || 0})
          </span>
        </div>

        {/* Free Delivery Badge */}
        {product.freeDelivery && (
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
            Free Delivery with W
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
