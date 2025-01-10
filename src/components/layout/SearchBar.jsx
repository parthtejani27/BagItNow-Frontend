import React, { useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../store/slices/productSlice";
import debounce from "lodash/debounce";

const SearchBar = ({ isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        navigate(`/products?search=${encodeURIComponent(query.trim())}`);
        dispatch(fetchProducts({ search: query.trim() }));
      } else {
        navigate("/products");
        dispatch(fetchProducts({}));
      }
    }, 500), // 500ms delay
    [navigate, dispatch]
  );

  useEffect(() => {
    // Update search input when URL search param changes
    const query = searchParams.get("q") || searchParams.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`${
        isMobile ? "w-full p-4 border-t border-theme-secondary" : "w-full"
      }`}
    >
      <div className="relative border border-theme-secondary rounded-full">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search for products..."
          className="w-full pl-10 pr-4 py-2.5 bg-theme-secondary text-theme-primary rounded-full 
                   focus:outline-none focus:ring-2 focus:ring-theme-tertiary transition-all"
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-tertiary" />
      </div>
    </form>
  );
};

export default SearchBar;
