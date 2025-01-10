import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, updateProfile } from "../../store/slices/authSlice";
import { toggleDarkMode, selectDarkMode } from "../../store/slices/appSlice";
import {
  Mail,
  Lock,
  Phone,
  User,
  Camera,
  Sun,
  Moon,
  Check,
  X,
  ChevronRight,
  Settings,
  Bell,
} from "lucide-react";

const ProfileField = ({
  label,
  value,
  icon: Icon,
  type = "text",
  verified,
  onEdit,
  disabled,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (inputValue === value || !inputValue.trim()) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onEdit(inputValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update:", error);
    }
    setIsLoading(false);
  };

  return (
    <div
      className={`group cursor-pointer rounded-2xl bg-theme-secondary/20 
      transition-all duration-200 hover:bg-theme-secondary/30 
      ${isEditing ? "ring-2 ring-accent-success/20" : ""}`}
    >
      <div
        className="p-4"
        onClick={() => !disabled && !isEditing && setIsEditing(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl bg-theme-secondary/50 
              flex items-center justify-center"
            >
              <Icon className="w-5 h-5 text-theme-primary/60" />
            </div>
            <div>
              <p className="text-sm text-theme-tertiary">{label}</p>
              {isEditing ? (
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type={type}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-theme-primary text-theme-primary px-3 py-2 
                      rounded-lg border border-theme-secondary focus:border-accent-success 
                      focus:outline-none focus:ring-1 focus:ring-accent-success"
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    disabled={isLoading}
                    autoFocus
                  />
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handleSubmit}
                      disabled={
                        isLoading || inputValue === value || !inputValue.trim()
                      }
                      className="p-2 text-accent-success hover:bg-accent-success/10 
                        rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setInputValue(value);
                      }}
                      disabled={isLoading}
                      className="p-2 text-red-500 hover:bg-red-500/10 
                        rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <p className="text-theme-primary font-medium">
                    {disabled ? "••••••••" : value}
                  </p>
                  {verified !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full 
                      ${
                        verified
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {verified ? "Verified" : "Unverified"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          {!isEditing && !disabled && (
            <ChevronRight
              className="w-5 h-5 text-theme-tertiary 
              transition-transform group-hover:translate-x-1"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const AccountSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isDarkMode = useSelector(selectDarkMode);

  const handleUpdate = (field) => async (value) => {
    try {
      await dispatch(updateProfile({ [field]: value })).unwrap();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Profile Header */}
      <div className="relative mb-8">
        <div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r 
          from-accent-success/10 to-accent-success/5 rounded-b-3xl"
        />

        <div className="relative pt-6">
          <div className="text-center">
            <div className="inline-block relative">
              <div
                className="w-28 h-28 rounded-2xl bg-theme-secondary overflow-hidden
                ring-4 ring-theme-primary shadow-lg"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center 
                    bg-accent-success/10"
                  >
                    <User className="w-12 h-12 text-accent-success" />
                  </div>
                )}
              </div>
              <button
                className="absolute -bottom-2 -right-2 p-2.5 rounded-xl 
                bg-theme-primary shadow-lg hover:shadow-xl transition-shadow
                border border-theme-secondary hover:border-accent-success group"
              >
                <Camera
                  className="w-5 h-5 text-theme-tertiary 
                  group-hover:text-accent-success transition-colors"
                />
              </button>
            </div>

            <h1 className="text-2xl font-semibold text-theme-primary mt-4">
              {user?.fullName}
            </h1>
            <p className="text-theme-tertiary">
              Member since {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Profile Information */}
        <div className="bg-theme-primary rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl bg-accent-success/10 
              flex items-center justify-center"
            >
              <Settings className="w-5 h-5 text-accent-success" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-theme-primary">
                Account Settings
              </h3>
              <p className="text-sm text-theme-tertiary">
                Manage your account information
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <ProfileField
              icon={User}
              label="Full Name"
              value={user?.fullName}
              onEdit={handleUpdate("fullName")}
            />
            <ProfileField
              icon={Mail}
              label="Email Address"
              value={user?.email}
              type="email"
              verified={user?.isEmailVerified}
              onEdit={handleUpdate("email")}
            />
            <ProfileField
              icon={Phone}
              label="Phone Number"
              value={user?.phone}
              type="tel"
              verified={user?.isPhoneVerified}
              onEdit={handleUpdate("phone")}
            />
            <ProfileField
              icon={Lock}
              label="Password"
              value="••••••••"
              disabled
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-theme-primary rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl bg-accent-success/10 
              flex items-center justify-center"
            >
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-accent-success" />
              ) : (
                <Sun className="w-5 h-5 text-accent-success" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-theme-primary">
                Preferences
              </h3>
              <p className="text-sm text-theme-tertiary">
                Customize your experience
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Theme Toggle */}
            <div
              className="flex items-center justify-between p-4 rounded-xl
              bg-theme-secondary/20 hover:bg-theme-secondary/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-xl bg-theme-secondary/50 
                  flex items-center justify-center"
                >
                  {isDarkMode ? (
                    <Moon className="w-5 h-5 text-theme-primary/60" />
                  ) : (
                    <Sun className="w-5 h-5 text-theme-primary/60" />
                  )}
                </div>
                <div>
                  <p className="text-theme-primary font-medium">Dark Mode</p>
                  <p className="text-sm text-theme-tertiary">
                    {isDarkMode ? "Dark theme enabled" : "Light theme enabled"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors duration-200 focus:outline-none focus:ring-2 
                  focus:ring-accent-success/20 bg-theme-secondary"
              >
                <span
                  className={`inline-block w-4 h-4 transform rounded-full 
                  bg-accent-success shadow-sm transition-transform duration-200
                  ${isDarkMode ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
