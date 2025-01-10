import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchProducts, selectProducts } from "../../store/slices/productSlice";

const ProductGrid = ({ title }) => {
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const sliderRef = useRef(null);

  const products = useSelector(selectProducts, shallowEqual);
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products]);

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      if (width < 640) {
        setItemsPerView(1.5);
      } else if (width < 768) {
        setItemsPerView(2.5);
      } else if (width < 1024) {
        setItemsPerView(3.5);
      } else {
        setItemsPerView(4.5);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const scrollLeft = () => {
    setTranslateX((prev) => {
      const newTranslate = prev + 100;
      return Math.min(newTranslate, 0);
    });
  };

  const scrollRight = () => {
    setTranslateX((prev) => {
      const maxTranslate = -(
        Math.ceil((products.length - itemsPerView) / itemsPerView) * 100
      );
      const newTranslate = prev - 100;
      return Math.max(newTranslate, maxTranslate);
    });
  };

  const canScrollLeft = translateX < 0;
  const canScrollRight =
    translateX >
    -(Math.ceil((products.length - itemsPerView) / itemsPerView) * 100);

  // Mobile View
  if (isMobile) {
    return (
      <div className="w-full py-4 bg-theme-primary">
        <div className="container mx-auto px-3">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-theme-primary">{title}</h2>
            <Link
              to="/products"
              className="text-sm text-theme-primary font-medium bg-theme-secondary px-3 py-1 rounded-full"
            >
              See all
            </Link>
          </div>

          <div className="overflow-x-auto scrollbar-hide -mx-3">
            <div className="flex gap-3 px-3 pb-2">
              {products.map((product) => (
                <div key={product._id} className="flex-none w-64">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="w-full py-8 bg-theme-primary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-theme-primary">
            {title}
          </h2>
          <div className="flex items-center space-x-2">
            <Link
              to="/products"
              className="text-theme-primary font-semibold hover:text-theme-secondary"
            >
              See All
            </Link>
            <button
              className="p-2 rounded-full bg-theme-secondary hover:bg-theme-tertiary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6 text-theme-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="p-2 rounded-full bg-theme-secondary hover:bg-theme-tertiary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={scrollRight}
              disabled={!canScrollRight}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6 text-theme-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${translateX}%)` }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
