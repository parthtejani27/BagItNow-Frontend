import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchCategories,
  selectSubcategories,
  selectCategories,
} from "../../store/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";

const CategorySlider = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const subcategories = useSelector(selectSubcategories);

  useEffect(() => {
    // Fetch categories only if they haven't been fetched already
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  const [itemsPerView, setItemsPerView] = useState(4);
  const [translateX, setTranslateX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      if (width < 640) {
        setItemsPerView(1);
      } else if (width < 768) {
        setItemsPerView(2);
      } else if (width < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => {
      window.removeEventListener("resize", updateItemsPerView);
    };
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
        Math.ceil((categories.length - itemsPerView) / itemsPerView) * 100
      );
      const newTranslate = prev - 100;
      return Math.max(newTranslate, maxTranslate);
    });
  };

  const canScrollLeft = translateX < 0;
  const canScrollRight =
    translateX >
    -(Math.ceil((categories.length - itemsPerView) / itemsPerView) * 100);

  // Mobile View
  if (isMobile) {
    return (
      <div className="w-full py-4 bg-theme-primary">
        <div className="container mx-auto px-3">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-theme-primary">
              Shop by Category
            </h2>
            {/* <Link
              to="/categories"
              className="text-sm text-theme-primary font-medium bg-theme-secondary px-3 py-1 rounded-full"
            >
              See all
            </Link> */}
          </div>

          <div className="overflow-x-auto scrollbar-hide -mx-3">
            <div className="flex gap-3 px-3 pb-2">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category._id}`}
                  className="flex-none w-28"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60">
                      <div className="absolute inset-x-0 bottom-0 p-2">
                        <h3 className="text-white text-xs font-medium text-center line-clamp-2">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop View (Unchanged)
  return (
    <div className="w-full py-8 bg-theme-primary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-theme-primary">
            Shop by Category
          </h2>
          <div className="flex items-center space-x-2">
            {/* <Link
              to="/categories"
              className="text-theme-primary font-semibold hover:text-theme-secondary"
            >
              See All
            </Link> */}
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
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category._id}`}
                className="group flex-none w-1/2 md:w-1/3 lg:w-1/4 px-2 transform transition-transform duration-500 hover:scale-105"
              >
                <div className="relative aspect-video">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-fill rounded-lg shadow-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-opacity duration-300 ease-in-out group-hover:bg-opacity-40 rounded-lg">
                    <span className="text-white text-sm md:text-lg font-bold border-2 border-white px-4 py-2 md:px-6 md:py-3 rounded-full opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                      Shop Now
                    </span>
                  </div>
                </div>
                <h3 className="mt-2 text-sm md:text-lg font-semibold text-center text-theme-primary">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySlider;
