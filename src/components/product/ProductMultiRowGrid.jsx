import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "./ProductCard";
import {
  fetchProducts,
  selectProducts,
  selectLoading,
} from "../../store/slices/productSlice";

const ProductMultiRowGrid = ({ title = "All Products" }) => {
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectLoading);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full bg-theme-primary">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-theme-secondary rounded-lg h-48 mb-2"></div>
                <div className="bg-theme-secondary h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-theme-secondary h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mobile View
  if (isMobile) {
    return (
      <div className="w-full py-4 bg-theme-primary">
        <div className="container mx-auto px-3">
          <h2 className="text-lg font-bold text-theme-primary mb-4">{title}</h2>
          <div className="grid grid-cols-1 gap-3">
            {products.map((product) => (
              <div key={product.id} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="mt-8 w-full bg-theme-primary">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-theme-primary">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* No Products Found */}
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-16 h-16 text-theme-tertiary mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-theme-secondary text-lg">No products found</p>
          </div>
        )}

        {/* Pagination could be added here */}
      </div>
    </div>
  );
};

export default ProductMultiRowGrid;
