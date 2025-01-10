import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  sendOTP,
  setCurrentStep,
  setType,
} from "../../../store/slices/authSlice";
import ErrorDisplay from "../../common/ErrorBoundary";
import MoreOptionsModal from "./MoreOptionsModal";
import { useNavigate } from "react-router-dom";

const PasswordLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, tempUserData } = useSelector((state) => state.auth);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

  const handleLogin = async () => {
    try {
      await dispatch(
        login({
          userId: tempUserData._id,
          password,
        })
      )
        .unwrap()
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleOptionSelect = (optionId) => {
    switch (optionId) {
      case "phone":
        // Handle phone call verification
        dispatch(
          sendOTP({
            emailOrPhone: tempUserData.phone,
          })
        )
          .unwrap()
          .then((result) => {
            dispatch(setType("phone"));
            dispatch(setCurrentStep("OTP_VERIFICATION"));
          })
          .catch((error) => {
            // handle error
            console.error("Error:", error);
          });
        break;
      case "email":
        // Handle email verification
        dispatch(
          sendOTP({
            emailOrPhone: tempUserData.email,
          })
        )
          .unwrap()
          .then((result) => {
            dispatch(setType("email"));
            dispatch(setCurrentStep("OTP_VERIFICATION"));
          })
          .catch((error) => {
            // handle error
            console.error("Error:", error);
          });
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6">
      {/* Header */}
      <h1 className="text-2xl font-medium mb-8">
        Welcome back. Sign in to continue.
      </h1>

      <ErrorDisplay error={error} />

      {/* Password Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Additional Options */}
      <div className="flex flex-col gap-2 mb-8">
        <button
          type="button"
          className="w-fit rounded-full bg-gray-100 px-6 py-2 text-sm hover:bg-gray-200"
          onClick={() => {
            // Handle forgot password
            dispatch(setCurrentStep("FORGOT_PASSWORD"));
          }}
        >
          I forgot my password
        </button>

        <button
          type="button"
          onClick={() => setIsMoreOptionsOpen(true)}
          className="w-fit rounded-full bg-gray-100 px-6 py-2 text-sm hover:bg-gray-200"
        >
          More options
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => dispatch(setCurrentStep("INITIAL"))}
          className="rounded-full bg-gray-100 px-6 py-2 hover:bg-gray-200"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleLogin}
          disabled={!password || loading}
          className={`px-6 py-2 rounded-full ${
            password && !loading
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Signing in..." : "Next"}
        </button>
      </div>

      {/* More Options Modal */}
      <MoreOptionsModal
        isOpen={isMoreOptionsOpen}
        onClose={() => setIsMoreOptionsOpen(false)}
        onOptionSelect={handleOptionSelect}
      />
    </div>
  );
};

export default PasswordLogin;
