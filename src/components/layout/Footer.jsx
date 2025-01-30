// components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Globe, ChevronDown } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    getHelp: [
      { label: "Get Help", url: "/help" },
      { label: "Buy gift cards", url: "/gift-cards" },
      { label: "Add your restaurant", url: "/restaurant/signup" },
      { label: "Sign up to deliver", url: "/deliver" },
      { label: "Create a business account", url: "/business" },
      { label: "Promotions", url: "/promotions" },
    ],
    restaurants: [
      { label: "Restaurants near me", url: "/restaurants-near-me" },
      { label: "View all cities", url: "/cities" },
      { label: "View all countries", url: "/countries" },
      { label: "Pickup near me", url: "/pickup-near-me" },
      { label: "About BagIt Now", url: "/about" },
      { label: "Shop groceries", url: "/groceries" },
    ],
  };

  return (
    <footer className="bg-theme-primary border-t border-theme-secondary pt-16 pb-8">
      <div className="container-custom">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Logo and Language */}
          <div className="md:col-span-3">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-bold text-theme-primary transition-colors">
                BagIt Now
              </h2>
            </Link>
            <button
              className="mt-6 flex items-center gap-2 px-4 py-2 
              border border-theme-secondary
              rounded-lg hover:bg-theme-tertiary
              text-theme-secondary
              transition-all duration-200"
            >
              <Globe className="w-5 h-5" />
              <span>English</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Links Section */}
          <div className="md:col-span-5">
            <div className="grid grid-cols-2 gap-8">
              {/* Help & Business */}
              <div>
                <h3 className="text-theme-primary font-medium mb-4">
                  Get Help
                </h3>
                <ul className="space-y-3">
                  {footerLinks.getHelp.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.url}
                        className="text-theme-secondary hover:text-theme-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Restaurants */}
              <div>
                <h3 className="text-theme-primary font-medium mb-4">
                  Restaurants
                </h3>
                <ul className="space-y-3">
                  {footerLinks.restaurants.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.url}
                        className="text-theme-secondary hover:text-theme-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* App Download */}
          <div className="md:col-span-4">
            <h3 className="text-theme-primary font-medium mb-4">Get the App</h3>
            <div className="flex flex-col gap-4">
              <a
                href="#"
                className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--background-primary)]
                  rounded-lg hover:opacity-90
                  transition-opacity text-center font-medium"
              >
                iPhone
              </a>
              <a
                href="#"
                className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--background-primary)]
                  rounded-lg hover:opacity-90
                  transition-opacity text-center font-medium"
              >
                Android
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-theme-secondary my-8"></div>

        {/* Bottom Section */}
        <div className="space-y-8">
          {/* Social Links */}
          <div className="flex justify-center gap-6">
            {["Facebook", "Twitter", "Instagram"].map((platform) => (
              <a
                key={platform}
                href="#"
                className="p-2.5 bg-theme-secondary rounded-full 
                  hover:bg-theme-tertiary
                  text-theme-tertiary
                  hover:text-theme-primary
                  transition-all duration-200"
                aria-label={platform}
              >
                {platform === "Facebook" && <Facebook className="w-5 h-5" />}
                {platform === "Twitter" && <Twitter className="w-5 h-5" />}
                {platform === "Instagram" && <Instagram className="w-5 h-5" />}
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {[
              { label: "Privacy Policy", url: "/privacy" },
              { label: "Terms", url: "/terms" },
              { label: "Pricing", url: "/pricing" },
              {
                label: "Do not sell or share my personal information",
                url: "/privacy-choices",
              },
            ].map((link) => (
              <Link
                key={link.url}
                to={link.url}
                className="text-theme-secondary
                  hover:text-theme-primary
                  transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright & Additional Info */}
          <div className="text-center text-sm text-theme-secondary space-y-4">
            <p>
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="#"
                className="underline hover:text-theme-primary transition-colors"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="underline hover:text-theme-primary transition-colors"
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>
            <p>© {new Date().getFullYear()} BagIt Technologies Inc.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
