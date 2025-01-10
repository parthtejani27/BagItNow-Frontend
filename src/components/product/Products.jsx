import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useParams } from "react-router-dom";
import { fetchProducts } from "../../store/slices/productSlice";
import ProductFilters from "./ProductFilters";
import ProductMultiRowGrid from "./ProductMultiRowGrid";

const Products = () => {
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: "",
    maxPrice: "",
    sortBy: "popularity",
  });

  const { products, loading, error } = useSelector((state) => state.product);
  const searchQuery = searchParams.get("search") || searchParams.get("q");

  useEffect(() => {
    // Clear filters when search query changes
    if (searchQuery) {
      setFilters({
        categories: [],
        minPrice: "",
        maxPrice: "",
        sortBy: "popularity",
      });
    }
  }, [searchQuery]);

  useEffect(() => {
    // Fetch products whenever filters, category, or search changes
    const queryParams = {
      ...(categoryId && { category: categoryId }),
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      ...(filters.sortBy && { sort: filters.sortBy }),
      ...(searchQuery && { search: searchQuery }),
    };

    dispatch(fetchProducts(queryParams));
  }, [dispatch, categoryId, filters, searchQuery]);

  useEffect(() => {
    // Set category from URL params
    if (categoryId) {
      setFilters((prev) => ({
        ...prev,
        categories: [categoryId],
      }));
    }
  }, [categoryId]);

  const handleFilterChange = (action) => {
    switch (action.type) {
      case "TOGGLE_CATEGORY":
        setFilters((prev) => ({
          ...prev,
          categories: prev.categories.includes(action.payload)
            ? prev.categories.filter((id) => id !== action.payload)
            : [...prev.categories, action.payload],
        }));
        break;
      case "SET_PRICE_RANGE":
        setFilters((prev) => ({
          ...prev,
          minPrice: action.payload.min,
          maxPrice: action.payload.max,
        }));
        break;
      case "SET_SORT":
        setFilters((prev) => ({
          ...prev,
          sortBy: action.payload,
        }));
        break;
      default:
        break;
    }
  };

  const getTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (categoryId) return "Category Products";
    return "All Products";
  };

  return (
    <div className="min-h-screen bg-theme-primary">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filters */}
          <div className="lg:col-span-3">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Products */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-theme-primary border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-600 p-4 rounded-lg">
                Error: {error}
              </div>
            ) : (
              <ProductMultiRowGrid
                products={products}
                title={getTitle()}
                showEmptyMessage={products.length === 0}
                emptyMessage={
                  searchQuery
                    ? `No products found for "${searchQuery}"`
                    : "No products found"
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
