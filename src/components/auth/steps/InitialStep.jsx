import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkUser,
  setCurrentStep,
  setType,
} from "../../../store/slices/authSlice";
import CountrySelector from "../../common/CountrySelector";
import ErrorDisplay from "../../common/ErrorBoundary";

const InitialStep = () => {
  const dispatch = useDispatch();
  const { loading, error, type } = useSelector((state) => state.auth);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [inputType, setInputType] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    flag: "🇨🇦",
    name: "Canada",
  });

  useEffect(() => {
    if (emailOrPhone) {
      if (/^\d+$/.test(emailOrPhone)) {
        setInputType("phone");
        dispatch(setType("phone"));

        // Format phone number for display
      } else if (emailOrPhone.includes("@")) {
        setInputType("email");
        dispatch(setType("email"));
      }
    } else {
      setInputType(null);
      dispatch(setType(null));
    }
  }, [dispatch, emailOrPhone]);

  const handleInputChange = (e) => {
    let value = e.target.value;

    // If phone input, only allow digits
    if (/^\d+$/.test(value) || value === "") {
      // Remove country code if it's pasted with the number
      value = value.replace(selectedCountry.code, "");
      // Remove any non-digits
      value = value.replace(/\D/g, "");
      // Limit to 10 digits
      value = value.slice(0, 10);
    }

    setEmailOrPhone(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone) return;

    dispatch(
      checkUser({
        emailOrPhone:
          inputType === "phone"
            ? `${selectedCountry.code}${emailOrPhone}`
            : emailOrPhone,
      })
    )
      .unwrap()
      .then((result) => {
        // handle success with direct access to result payload
        console.log("Success:", result);
        dispatch(setCurrentStep("OTP_VERIFICATION"));
      })
      .catch((error) => {
        // handle error
        console.error("Error:", error);
      });
  };

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <h1 className="text-2xl font-medium mb-6">
        What&apos;s your phone number or email?
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ErrorDisplay error={error} />
        {/* Main Input */}
        <div className="flex">
          {inputType === "phone" && (
            <CountrySelector
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
            />
          )}
          <input
            type="text"
            value={emailOrPhone}
            onChange={handleInputChange}
            placeholder="Enter phone number or email"
            className={`w-full flex-1 px-4 py-3 text-base bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black
              `}
          />
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={loading || !emailOrPhone}
          className={`w-full py-3 px-4 text-center text-white 
            ${!emailOrPhone ? "bg-gray-300" : "bg-black"} 
            rounded-lg font-medium`}
        >
          {loading ? "Please wait..." : "Continue"}
        </button>

        {/* Divider */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Social Login Buttons */}
        <button
          type="button"
          className="w-full py-3 px-4 bg-gray-100 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <img
            src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          className="w-full py-3 px-4 bg-gray-100 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <img
            src="https://cdn.cdnlogo.com/logos/a/12/apple.svg"
            alt="Apple"
            className="w-5 h-5"
          />
          <span>Continue with Apple</span>
        </button>

        <button
          type="button"
          className="w-full py-3 px-4 bg-gray-100 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v1m6 11h2m-6 0h-2m0 0H8m4 0h4m-4-8a3 3 0 100 6 3 3 0 000-6z"
            />
          </svg>
          <span>Log in with QR code</span>
        </button>

        {/* Terms Text */}
        <p className="text-sm text-gray-500 mt-6">
          By proceeding, you consent to get calls, WhatsApp or SMS/RCS messages,
          including by automated means, from Uber and its affiliates to the
          number provided.
        </p>
      </form>
    </div>
  );
};

export default InitialStep;
