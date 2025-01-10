import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Settings,
  MapPin,
  CreditCard,
  Bell,
  LogOut,
  ShoppingBag,
  Gift,
  ChevronLeft,
  User,
  ChevronRight,
} from "lucide-react";
import { logout } from "../../store/slices/authSlice";

const menuItems = [
  {
    id: "settings",
    icon: <Settings className="w-5 h-5" />,
    label: "Account Settings",
    description: "Personal information, email, phone",
  },
  {
    id: "orders",
    icon: <ShoppingBag className="w-5 h-5" />,
    label: "Orders & History",
    description: "Past orders, tracking, returns",
  },
  {
    id: "addresses",
    icon: <MapPin className="w-5 h-5" />,
    label: "Saved Addresses",
    description: "Delivery locations, billing addresses",
  },
  {
    id: "payment",
    icon: <CreditCard className="w-5 h-5" />,
    label: "Payment Methods",
    description: "Cards, wallet, saved payment info",
  },
  {
    id: "credits",
    icon: <Gift className="w-5 h-5" />,
    label: "Credits & Promos",
    description: "Gift cards, offers, referrals",
  },
  {
    id: "notifications",
    icon: <Bell className="w-5 h-5" />,
    label: "Notifications",
    description: "Order updates, promotions, alerts",
  },
];

const ProfileLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("settings");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/profile/${section}`);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-theme-secondary">
      {/* Header */}
      <header className="bg-theme-primary border-b border-theme-secondary sticky top-0 z-30">
        <div className="container-custom">
          <div className="h-16 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-theme-primary hover:text-accent-success transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container-custom py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden md:block w-80 space-y-2">
            <div className="bg-theme-primary rounded-xl p-4 shadow-sm">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
                    ${
                      activeSection === item.id
                        ? "bg-theme-secondary text-accent-success"
                        : "text-theme-primary hover:bg-theme-secondary/50"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={
                        activeSection === item.id
                          ? "text-accent-success"
                          : "text-theme-tertiary"
                      }
                    >
                      {item.icon}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-theme-tertiary">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      activeSection === item.id
                        ? "text-accent-success"
                        : "text-theme-tertiary"
                    }`}
                  />
                </button>
              ))}

              <div className="h-px bg-theme-secondary my-3" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="w-5 h-5" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Log Out</p>
                    <p className="text-xs text-red-400">
                      Sign out of your account
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-accent-success text-white p-4 rounded-full shadow-lg"
            >
              <User className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-black/50 z-40 flex items-end">
              <div className="bg-theme-primary w-full rounded-t-2xl p-6 space-y-4 animate-slide-up">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className="w-full flex items-center space-x-4 p-3 rounded-lg"
                  >
                    <span className="text-theme-tertiary">{item.icon}</span>
                    <span className="text-theme-primary">{item.label}</span>
                  </button>
                ))}
                <div className="h-px bg-theme-secondary" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-4 p-3 text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-theme-primary rounded-xl p-6 shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
