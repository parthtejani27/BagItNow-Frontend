import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendOTP,
  setCurrentStep,
  setType,
  updateTempUserData,
} from "../../../store/slices/authSlice";
import ErrorDisplay from "../../common/ErrorBoundary";
import CountrySelector from "../../common/CountrySelector";

const AdditionalContact = () => {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    isRegistered,
    verifiedEmail,
    verifiedPhone,
    tempUserData,
    type,
  } = useSelector((state) => state.auth);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    flag: "🇨🇦",
    name: "Canada",
  });

  useEffect(() => {
    if (verifiedEmail) {
      dispatch(setType("phone"));
    } else if (verifiedPhone) {
      dispatch(setType("email"));
    }
  });

  const handleSkip = () => {
    dispatch(setCurrentStep("PASSWORD"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone) return;

    dispatch(
      sendOTP({
        emailOrPhone:
          type === "phone"
            ? `${selectedCountry.code}${emailOrPhone}`
            : emailOrPhone,
      })
    )
      .unwrap()
      .then((result) => {
        // handle success with direct access to result payload
        console.log("Success:", result);
        if (type === "phone") {
          dispatch(
            updateTempUserData({ phone: selectedCountry.code + emailOrPhone })
          );
        } else {
          dispatch(updateTempUserData({ email: emailOrPhone }));
        }

        dispatch(setCurrentStep("OTP_VERIFICATION"));
      })
      .catch((error) => {
        // handle error
        console.error("Error:", error);
      });
  };

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <h1 className="text-2xl font-medium mb-2">
        {type === "phone" ? "Enter your mobile number" : "Enter your Email"}
      </h1>
      <h1 className="text-2xl font-medium mb-6">(Optional)</h1>

      {type === "phone" && (
        <p className="text-md text-gray-500 mb-6">
          Add your mobile to aid in account recovery
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ErrorDisplay error={error} />
        {/* Main Input */}
        <div className="flex">
          {type === "phone" && (
            <CountrySelector
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
            />
          )}
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="Enter phone number or email"
            className={`w-full flex-1 px-4 py-3 text-base bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black
              `}
          />
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="rounded-2xl bg-gray-200 px-6 py-2 hover:bg-gray-300"
        >
          Skip
        </button>

        {/* Continue Button */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => dispatch(setCurrentStep("INITIAL"))}
            className="rounded-2xl bg-gray-200 px-6 py-2 hover:bg-gray-300"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !emailOrPhone}
            className={`px-6 py-2 rounded-2xl 
            ${
              !emailOrPhone && !loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "Verifying..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdditionalContact;
