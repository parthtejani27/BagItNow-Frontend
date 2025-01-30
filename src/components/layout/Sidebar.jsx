import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  X,
  Briefcase,
  Store,
  Phone,
  User,
  ShoppingBag,
  Heart,
  Wallet,
  Calendar,
  HelpCircle,
  Car,
  Gift,
  Crown,
  Users,
  LogOut,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.auth.user);

  const GuestContent = () => (
    <div className="p-4">
      {/* Auth Buttons */}
      <div className="mb-6">
        <Link
          to="/signup"
          className="block w-full py-3 px-4 bg-[var(--accent-primary)] text-[var(--background-primary)] text-center rounded-full mb-3"
        >
          Sign up
        </Link>
        <Link
          to="/login"
          className="block w-full py-3 px-4 border border-theme-secondary text-center rounded-full hover:bg-theme-tertiary"
        >
          Log in
        </Link>
      </div>

      {/* Business Links */}
      <div className="space-y-4">
        <Link
          to="/business"
          className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg"
        >
          <Briefcase className="w-6 h-6" />
          <span>Create a business account</span>
        </Link>

        <Link
          to="/restaurant/signup"
          className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg"
        >
          <Store className="w-6 h-6" />
          <span>Add your restaurant</span>
        </Link>

        <Link
          to="/deliver"
          className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg"
        >
          <Phone className="w-6 h-6" />
          <span>Sign up to deliver</span>
        </Link>
      </div>

      {/* Mobile App Promotion */}
      <div className="mt-8 pt-6 border-t border-theme-secondary">
        <h3 className="font-medium mb-2">
          There&apos;s more to love in the app
        </h3>
        <div className="flex gap-2 mt-4">
          <a
            href="#"
            className="flex-1 py-2 px-4 bg-theme-secondary rounded-lg text-center hover:bg-theme-tertiary"
          >
            iPhone
          </a>
          <a
            href="#"
            className="flex-1 py-2 px-4 bg-theme-secondary rounded-lg text-center hover:bg-theme-tertiary"
          >
            Android
          </a>
        </div>
      </div>
    </div>
  );

  const UserContent = () => (
    <>
      {/* User Profile Section */}
      <div className="p-4 border-b border-theme-secondary">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-theme-secondary flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.firstName}
                className="w-full h-full rounded-full"
              />
            ) : (
              <User className="w-6 h-6 text-theme-tertiary" />
            )}
          </div>
          <div>
            <h2 className="font-medium">{user?.firstName || "User"}</h2>
            <Link
              to="/profile"
              className="text-sm text-accent-success hover:text-accent-success-dark"
            >
              Manage account
            </Link>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <Link
          to="/orders"
          className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg"
        >
          <ShoppingBag className="w-6 h-6" />
          <span>Orders</span>
        </Link>
        <Link
          to="/favorites"
          className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg"
        >
          <Heart className="w-6 h-6" />
          <span>Favorites</span>
        </Link>
        <Link
          to="/wallet"
          className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg"
        >
          <Wallet className="w-6 h-6" />
          <span>Wallet</span>
        </Link>
        <Link
          to="/meal-plan"
          className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg"
        >
          <Calendar className="w-6 h-6" />
          <span>Meal plan</span>
        </Link>
        <Link
          to="/help"
          className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg"
        >
          <HelpCircle className="w-6 h-6" />
          <span>Help</span>
        </Link>
        <Link
          to="/ride"
          className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg"
        >
          <Car className="w-6 h-6" />
          <span>Get a ride</span>
        </Link>
        <Link
          to="/promotions"
          className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg"
        >
          <Gift className="w-6 h-6" />
          <span>Promotions</span>
        </Link>
        <Link
          to="/bagit-one"
          className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg"
        >
          <Crown className="w-6 h-6" />
          <div>
            <div>BagIt One</div>
            <div className="text-sm text-theme-tertiary">
              Try free for 4 weeks
            </div>
          </div>
        </Link>
        <Link
          to="/invite"
          className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg"
        >
          <Users className="w-6 h-6" />
          <div>
            <div>Invite friends</div>
            <div className="text-sm text-theme-tertiary">You get ₹100 off</div>
          </div>
        </Link>
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-theme-secondary">
        <button className="flex items-center gap-3 p-3 hover:bg-theme-tertiary rounded-lg w-full">
          <LogOut className="w-6 h-6" />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[300px] bg-theme-primary z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        {/* Header */}
        <div className="border-b border-theme-secondary p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-tertiary rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conditional Content */}
        {user ? <UserContent /> : <GuestContent />}
      </div>
    </>
  );
};

export default Sidebar;
