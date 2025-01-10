import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Heart, Minus, Plus, Share2 } from "lucide-react";
import {
  fetchProductById,
  selectCurrentProduct,
  selectError,
  selectLoading,
} from "../../store/slices/productSlice";
import ProductGrid from "./ProductGrid";
import {
  addItemToCart,
  removeItemFromCart,
  selectCartItems,
  updateItemQuantity,
} from "../../store/slices/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [isWishlist, setIsWishlist] = useState(false);

  const product = useSelector(selectCurrentProduct, shallowEqual);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const cartItems = useSelector(selectCartItems); // Get cart items from Redux state

  const isProductInCart = cartItems.some((item) => item.product === id);
  useEffect(() => {
    const p = cartItems.find((item) => item.product === id);
    if (p) {
      setQuantity(p.quantity); // Only set quantity if a matching item is found
    }
  }, [cartItems, id]);

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => Math.min(prev + 1, 10));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleAddToCart = () => {
    dispatch(addItemToCart({ id: product._id, quantity: quantity }));
  };

  const handleUpdateQuantity = () => {
    dispatch(
      updateItemQuantity({ productId: product._id, quantity: quantity })
    ); // Update the item in the cart
  };

  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart(id)); // Dispatch action to remove item from cart
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Skeleton */}
          <div className="aspect-square bg-theme-secondary animate-pulse rounded-xl" />

          {/* Content Skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-theme-secondary animate-pulse rounded w-3/4" />
            <div className="h-6 bg-theme-secondary animate-pulse rounded w-1/2" />
            <div className="h-24 bg-theme-secondary animate-pulse rounded" />
            <div className="h-12 bg-theme-secondary animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <div className=" bg-theme-primary">
        <div className="container-custom py-8">
          {/* Top Section - Breadcrumb and Actions */}
          <div className="flex justify-between items-center">
            {/* Breadcrumb */}
            <nav>
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <button
                    onClick={() => navigate("/")}
                    className="text-theme-secondary hover:text-theme-primary transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li className="text-theme-tertiary">/</li>
                <li>
                  <button
                    onClick={() => navigate("/products")}
                    className="text-theme-secondary hover:text-theme-primary transition-colors"
                  >
                    Products
                  </button>
                </li>
                <li className="text-theme-tertiary">/</li>
                <li className="text-theme-primary font-medium">
                  {product.category}
                </li>
              </ol>
            </nav>

            {/* Share Button */}
            <button className="p-2 rounded-full hover:bg-theme-secondary transition-colors group">
              <Share2 className="w-5 h-5 text-theme-tertiary group-hover:text-theme-primary transition-colors" />
            </button>
          </div>

          {/* Main Content Card */}
          <div className="card-theme">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column - Images */}
              <div className="p-6 md:p-8">
                <div className="space-y-6">
                  {/* Main Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-theme-secondary to-theme-primary/5">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain p-6"
                    />
                    <button
                      onClick={() => setIsWishlist(!isWishlist)}
                      className="absolute top-4 right-4 p-2.5 rounded-full 
                             bg-theme-primary shadow-lg backdrop-blur-sm
                             hover:bg-theme-secondary transition-all duration-200
                             group"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isWishlist
                            ? "fill-red-500 text-red-500"
                            : "text-theme-tertiary group-hover:text-theme-primary"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Badges Section */}
                  {product.badges && (
                    <div className="flex flex-wrap gap-2">
                      {product.badges.map((badge) => (
                        <span
                          key={badge}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium
                                 bg-theme-secondary/50 text-theme-primary"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="p-6 md:p-8 space-y-8">
                {/* Header Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-theme-primary">
                      {product.name}
                    </h1>
                    {product.stockStatus && (
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-lg
                                   text-sm font-medium bg-accent-success/10 text-accent-success"
                      >
                        {product.stockStatus}
                      </span>
                    )}
                  </div>

                  {/* Price Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-semibold text-theme-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.unitPrice && (
                        <span
                          className="text-sm px-3 py-1.5 rounded-lg
                                     bg-theme-secondary text-theme-tertiary"
                        >
                          ${product.unitPrice}/kg
                        </span>
                      )}
                    </div>
                    {product.approxWeight && (
                      <p className="text-sm text-theme-tertiary">
                        Approx. {product.approxWeight} each
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-sm max-w-none text-theme-secondary">
                  <p className="leading-relaxed">{product.description}</p>
                </div>

                {/* Options Section */}
                <div className="space-y-6">
                  {/* Weight Selection */}
                  {product.weights && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-theme-primary">
                        Select Weight
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.weights.map((weight) => (
                          <button
                            key={weight}
                            onClick={() => setSelectedWeight(weight)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium 
                                    transition-all duration-200
                                    ${
                                      selectedWeight === weight
                                        ? "bg-theme-primary text-theme-primary border-2 border-theme-primary"
                                        : "bg-theme-secondary text-theme-secondary hover:bg-theme-tertiary"
                                    }`}
                          >
                            {weight}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  {!isProductInCart ? (
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-theme-primary">
                        Quantity
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center rounded-xl border border-theme-primary">
                          <button
                            onClick={() => handleQuantityChange("decrement")}
                            disabled={quantity <= 1}
                            className="p-3 text-theme-primary hover:bg-theme-secondary
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-colors rounded-l-xl"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium text-theme-primary">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange("increment")}
                            disabled={quantity >= 10}
                            className="p-3 text-theme-primary hover:bg-theme-secondary
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-colors rounded-r-xl"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {quantity > 1 && (
                          <div className="text-sm text-theme-tertiary">
                            <span className="text-theme-secondary font-medium">
                              ${(product.price * quantity).toFixed(2)}
                            </span>{" "}
                            total
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* Add to Cart or Update Quantity Button */}
                  {isProductInCart ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        {/* Unified Black Button for Quantity Control */}
                        <div className="flex items-center justify-center gap-4">
                          {/* Decrement Button */}
                          <button
                            onClick={() => handleQuantityChange("decrement")}
                            disabled={quantity <= 1}
                            className="p-3 bg-theme-secondary text-theme-primary hover:bg-theme-tertiary
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors rounded-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          {/* Quantity Display */}
                          <span
                            className="w-12 text-center font-medium text-theme-primary bg-theme-secondary
                 py-2 rounded-lg"
                          >
                            {quantity}
                          </span>

                          {/* Increment Button */}
                          <button
                            onClick={() => handleQuantityChange("increment")}
                            disabled={quantity >= 10}
                            className="p-3 bg-theme-secondary text-theme-primary hover:bg-theme-tertiary
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors rounded-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Update Quantity Button */}
                        <button
                          onClick={handleUpdateQuantity}
                          disabled={
                            cartItems.find((item) => item.product === id)
                              ?.quantity === quantity
                          }
                          className={`w-full h-14 max-w-xs rounded-xl font-medium shadow-lg 
              transition-all duration-200 ${
                cartItems.find((item) => item.product === id)?.quantity ===
                quantity
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
                        >
                          Update
                        </button>
                      </div>

                      <button
                        onClick={handleRemoveFromCart}
                        className="w-full h-14 button-theme-secondary text-base font-medium shadow-lg shadow-accent-primary/10"
                      >
                        Remove from Cart
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="w-full h-14 button-theme-primary text-base font-medium shadow-lg shadow-accent-primary/10"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductGrid title="Similar Product" />
    </>
  );
};

export default ProductDetail;
