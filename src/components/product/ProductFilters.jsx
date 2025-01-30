import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { selectCategories } from "../../store/slices/categorySlice";

const ProductFilters = ({ filters, onFilterChange }) => {
  const categories = useSelector(selectCategories);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    sort: true,
    brands: true,
  });
  const [isSortOpen, setIsSortOpen] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    console.log(categories);
  });

  // Active filter tags
  const getActiveFilters = () => {
    const active = [];

    // Add category filters
    filters.categories?.forEach((catId) => {
      const category = categories.find((c) => c.id === catId);
      if (category) {
        active.push({
          id: `cat-${catId}`,
          label: category.name,
          type: "category",
        });
      }
    });

    // Add price filter
    if (filters.minPrice || filters.maxPrice) {
      active.push({
        id: "price-range",
        label: `$${filters.minPrice || 0} - $${filters.maxPrice || "∞"}`,
        type: "price",
      });
    }

    return active;
  };

  const handleRemoveFilter = (filter) => {
    if (filter.type === "category") {
      onFilterChange({
        type: "TOGGLE_CATEGORY",
        payload: parseInt(filter.id.split("-")[1]),
      });
    } else if (filter.type === "price") {
      onFilterChange({
        type: "SET_PRICE_RANGE",
        payload: { min: "", max: "" },
      });
    }
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-theme-primary last:border-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-4 px-1"
      >
        <span className="text-lg font-medium text-theme-primary">{title}</span>
        {expandedSections[section] ? (
          <ChevronUp className="w-5 h-5 text-theme-tertiary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-theme-tertiary" />
        )}
      </button>
      {expandedSections[section] && <div className="pb-4 px-1">{children}</div>}
    </div>
  );

  return (
    <div className="mt-8 bg-theme-primary  rounded-lg shadow-md border border-theme-primary">
      {/* Active Filters */}
      <div className="p-4 border-b border-theme-primary">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-theme-primary">
            Active Filters
          </h3>
          {getActiveFilters().length > 0 && (
            <button
              onClick={() => onFilterChange({ type: "RESET_FILTERS" })}
              className="text-sm text-theme-secondary hover:text-theme-primary transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {getActiveFilters().map((filter) => (
            <span
              key={filter.id}
              className="inline-flex items-center px-3 py-1 rounded-full 
                       bg-theme-secondary text-theme-primary text-sm"
            >
              {filter.label}
              <button
                onClick={() => handleRemoveFilter(filter)}
                className="ml-2 hover:text-theme-tertiary"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
          {getActiveFilters().length === 0 && (
            <span className="text-theme-tertiary text-sm">
              No active filters
            </span>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-4">
        {/* Categories Section */}
        <FilterSection title="Categories" section="categories">
          <div className="space-y-2">
            {categories?.map((category) => (
              <label
                key={category._id}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories?.includes(category._id)}
                    onChange={() =>
                      onFilterChange({
                        type: "TOGGLE_CATEGORY",
                        payload: category._id,
                      })
                    }
                    className="w-5 h-5 border-2 border-theme-primary rounded 
                             text-[var(--accent-primary)] bg-theme-primary
                             focus:ring-[var(--accent-primary)] focus:ring-offset-0 
                             focus:ring-offset-theme-primary transition-colors
                             cursor-pointer"
                  />
                </div>
                <span className="text-theme-secondary group-hover:text-theme-primary transition-colors">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range Section */}
        <FilterSection title="Price Range" section="price">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-tertiary text-sm">
                  $
                </div>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    onFilterChange({
                      type: "SET_MIN_PRICE",
                      payload: e.target.value,
                    })
                  }
                  className="w-full h-11 pl-6 pr-3 bg-theme-secondary 
                           text-theme-primary placeholder-theme-tertiary text-sm
                           rounded-xl border border-transparent
                           focus:border-[var(--accent-primary)] focus:outline-none
                           transition-colors duration-200"
                />
              </div>

              <div className="text-theme-tertiary text-sm">to</div>

              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-tertiary text-sm">
                  $
                </div>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    onFilterChange({
                      type: "SET_MAX_PRICE",
                      payload: e.target.value,
                    })
                  }
                  className="w-full h-11 pl-6 pr-3 bg-theme-secondary 
                           text-theme-primary placeholder-theme-tertiary text-sm
                           rounded-xl border border-transparent
                           focus:border-[var(--accent-primary)] focus:outline-none
                           transition-colors duration-200"
                />
              </div>
            </div>

            <button
              onClick={() => onFilterChange({ type: "APPLY_PRICE_RANGE" })}
              disabled={!filters.minPrice && !filters.maxPrice}
              className="w-full h-11 bg-[var(--accent-primary)] 
                       text-[var(--background-primary)] rounded-xl
                       text-sm font-medium
                       hover:opacity-90 transition-opacity duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Price Range
            </button>
          </div>
        </FilterSection>

        {/* Sort By Section */}
        <FilterSection title="Sort By" section="sort">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full h-11 px-4 bg-theme-secondary
                        border border-transparent rounded-xl
                        flex items-center justify-between 
                        text-theme-primary
                        hover:border-[var(--accent-primary)]
                        transition-all duration-200"
            >
              <span className="text-[15px]">
                {filters.sortBy === "popularity" && "Most Popular"}
                {filters.sortBy === "price_asc" && "Price: Low to High"}
                {filters.sortBy === "price_desc" && "Price: High to Low"}
                {filters.sortBy === "newest" && "Newest First"}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-theme-tertiary transition-transform duration-200
                          ${isSortOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isSortOpen && (
              <>
                <div
                  className="fixed inset-0 z-10 bg-black/20 dark:bg-black/40"
                  onClick={() => setIsSortOpen(false)}
                />

                <div
                  className="absolute z-20 w-full mt-2 py-1 
                              bg-theme-primary border border-theme-primary 
                              rounded-xl shadow-lg overflow-hidden"
                >
                  {[
                    { value: "popularity", label: "Most Popular" },
                    { value: "price_asc", label: "Price: Low to High" },
                    { value: "price_desc", label: "Price: High to Low" },
                    { value: "newest", label: "Newest First" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onFilterChange({
                          type: "SET_SORT",
                          payload: option.value,
                        });
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-[15px]
                                transition-colors duration-150
                                ${
                                  filters.sortBy === option.value
                                    ? "bg-[var(--accent-primary)] text-[var(--background-primary)]"
                                    : "text-theme-primary hover:bg-theme-secondary"
                                }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default ProductFilters;
