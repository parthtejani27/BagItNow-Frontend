import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCart } from "react-icons/io5";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MapPin } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import DeliveryToggle from "./DeliveryToggle";
import LocationSelector from "./LocationSelector";
import DarkModeToggle from "../theme/DarkModeToggle";
import { getCart, selectCartTotalItems } from "../../store/slices/cartSlice";

const Navbar = ({ toggleSidebar, toggleCart }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCart()); // Fetch cart data when the component mounts
  }, [dispatch]);

  const cartItemsCount = useSelector(selectCartTotalItems);
  const user = useSelector((state) => state.auth?.user);

  return (
    <div className="border-b border-theme-primary">
      <div className=" mx-auto">
        {/* max-w-7xl */}
        {/* Main Header */}
        <div className="flex items-center justify-between gap-4 px-4 h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-theme-secondary rounded-full transition-colors"
            >
              <GiHamburgerMenu className="w-6 h-6 text-theme-secondary" />
            </button>

            <Logo />

            {/* Delivery/Pickup Options - Hidden on mobile */}
            <DeliveryToggle />

            {/* Location - Hidden on mobile */}
            <LocationSelector />
          </div>

          {/* Center Section - Search Bar (Hidden on mobile) */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Cart Button with Enhanced Count Display */}
            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-theme-secondary rounded-full transition-colors"
              aria-label={`Cart with ${cartItemsCount} items`}
            >
              <IoCart className="w-6 h-6 text-theme-secondary" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-accent-success text-white text-xs font-medium rounded-full flex items-center justify-center px-1">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {!user && (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/auth" className="button-theme-secondary px-4 py-2">
                  Log in
                </Link>
                <Link to="/signup" className="button-theme-primary px-4 py-2">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden">
          <SearchBar isMobile />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
