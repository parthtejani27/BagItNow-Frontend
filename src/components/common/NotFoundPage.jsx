import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Home, Search, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-theme-secondary flex flex-col items-center justify-center px-4">
      {/* Main Content */}
      <div className="max-w-md w-full text-center">
        {/* 404 Text */}
        <h1 className="text-9xl font-bold text-theme-tertiary">404</h1>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-theme-primary mb-2">
            Page not found
          </h2>
          <p className="text-theme-secondary">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            page might have been removed or the link might be broken.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 p-4 bg-theme-primary rounded-lg border border-theme-secondary hover:border-theme-tertiary transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Homepage</span>
          </Link>

          <Link
            to="/products"
            className="flex items-center justify-center gap-2 p-4 bg-theme-primary rounded-lg border border-theme-secondary hover:border-theme-tertiary transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>All Products</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-3 pl-12 bg-theme-primary border border-theme-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-tertiary w-5 h-5" />
          </div>
        </div>

        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center gap-2 text-theme-secondary hover:text-theme-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go back</span>
        </button>
      </div>

      {/* Additional Help Links */}
      <div className="mt-12 text-center">
        <p className="text-theme-secondary mb-4">Need help?</p>
        <div className="flex gap-6 text-sm">
          <Link
            to="/contact"
            className="text-theme-secondary hover:text-theme-primary transition-colors"
          >
            Contact Support
          </Link>
          <Link
            to="/faq"
            className="text-theme-secondary hover:text-theme-primary transition-colors"
          >
            FAQs
          </Link>
          <Link
            to="/help"
            className="text-theme-secondary hover:text-theme-primary transition-colors"
          >
            Help Center
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
