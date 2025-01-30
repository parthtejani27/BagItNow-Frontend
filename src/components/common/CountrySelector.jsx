import React, { useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

const countries = [
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  // Add more countries as needed
];

const CountrySelector = ({ selectedCountry, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  return (
    <div className="relative mr-1" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 text-theme-primary bg-theme-secondary rounded-l-lg h-full border-r border-theme-secondary"
      >
        <span className="mr-1">{selectedCountry.flag}</span>
        <span>{selectedCountry.code}</span>
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 max-h-60 overflow-y-auto bg-theme-primary border border-theme-secondary rounded-lg shadow-lg z-50">
          {countries.map((country) => (
            <button
              key={`${country.code}-${country.name}`}
              type="button"
              onClick={() => {
                onSelect(country);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-theme-tertiary flex items-center space-x-3"
            >
              <span className="text-xl">{country.flag}</span>
              <span>{country.name}</span>
              <span className="text-theme-tertiary">{country.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
