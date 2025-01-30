import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savePassword, setCurrentStep } from "../../../store/slices/authSlice";
import { IoEyeOff, IoEyeOutline } from "react-icons/io5";

const PasswordStep = () => {
  const dispatch = useDispatch();
  const { loading, error, tempUserData } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Password validation function
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordError(validatePassword(value));
    }
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const validationError = validatePassword(formData.password);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    try {
      // Save password to temp data
      await dispatch(
        savePassword({
          userId: tempUserData._id,
          password: formData.password,
        })
      );
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleBack = () => {
    dispatch(setCurrentStep("ADDITIONAL_INFO"));
  };

  return (
    <div className="w-full max-w-md mx-auto px-6">
      {/* Title */}
      <h1 className="text-2xl font-medium mb-2">Create a password</h1>

      <p className="text-gray-600 mb-6">Must be at least 8 characters long</p>

      {/* Form */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Password Input with Show/Hide */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <IoEyeOutline className="h-5 w-5" />
              ) : (
                <IoEyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Input with Show/Hide */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black pr-12"
            />
            <button
              type="button"
              tabIndex="-1"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <IoEyeOutline className="h-5 w-5" />
              ) : (
                <IoEyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="space-y-2 text-sm text-gray-600">
          <p className={formData.password.length >= 8 ? "text-green-500" : ""}>
            • At least 8 characters
          </p>
          <p
            className={/[A-Z]/.test(formData.password) ? "text-green-500" : ""}
          >
            • One uppercase letter
          </p>
          <p
            className={/[a-z]/.test(formData.password) ? "text-green-500" : ""}
          >
            • One lowercase letter
          </p>
          <p
            className={/[0-9]/.test(formData.password) ? "text-green-500" : ""}
          >
            • One number
          </p>
          <p
            className={
              /[!@#$%^&*]/.test(formData.password) ? "text-green-500" : ""
            }
          >
            • One special character
          </p>
        </div>

        {/* Error Display */}
        {(passwordError || error) && (
          <p className="text-red-500 text-sm">{passwordError || error}</p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-2xl bg-gray-200 px-6 py-2 hover:bg-gray-300"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !formData.password ||
              !formData.confirmPassword ||
              loading ||
              passwordError
            }
            className={`px-6 py-2 rounded-2xl 
              ${
                !formData.password ||
                !formData.confirmPassword ||
                loading ||
                passwordError
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
          >
            {loading ? "Processing..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordStep;
