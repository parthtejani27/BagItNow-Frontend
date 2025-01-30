import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyOTP,
  sendOTP,
  setCurrentStep,
  setType,
} from "../../../store/slices/authSlice";
import ErrorDisplay from "../../common/ErrorBoundary";
import MoreOptionsModal from "./MoreOptionsModal";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, tempUserData, isRegistered, type, verificationId } =
    useSelector((state) => state.auth);

  // State for OTP inputs
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  const [resendSuccess, setResendSuccess] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

  // Timer effect
  useEffect(() => {
    const countdown = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  // Focus management
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
      case "password":
        // Handle password login
        dispatch(setCurrentStep("PASSWORD_LOGIN"));
        break;
      default:
        break;
    }
  };

  const handleInputChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Function to show and automatically hide success message
  const showSuccessMessage = () => {
    setResendSuccess(true);
    setTimeout(() => {
      setResendSuccess(false);
    }, 3000); // Hide after 3 seconds
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      await dispatch(
        sendOTP({
          emailOrPhone:
            type === "phone" ? tempUserData.phone : tempUserData.email,
        })
      ).unwrap();
      showSuccessMessage();
      setTimer(60);
    } catch (err) {
      console.error("Error resending OTP:", err);
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    try {
      await dispatch(
        verifyOTP({
          userId: tempUserData._id,
          type: type,
          value: tempUserData[type],
          otp: otpValue,
          verificationId: verificationId,
        })
      )
        .unwrap()
        .then(() => {
          isRegistered ? navigate("/") : null;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.error("Error verifying OTP:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <h1 className="text-2xl font-medium mb-6">
        Enter the 6-digit code sent to
        <br />
        {type === "email"
          ? `********${tempUserData.email.slice(-13)}`
          : `********${tempUserData.phone.slice(-3)}`}
      </h1>

      {resendSuccess && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Code sent successfully to{" "}
              {type === "email"
                ? `********${tempUserData.email.slice(-13)}`
                : `********${tempUserData.phone.slice(-3)}`}
            </span>
          </div>
        </div>
      )}

      <ErrorDisplay error={error} />

      {/* OTP Input Fields */}
      <div className="flex justify-between gap-4 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-14 h-14 text-center text-2xl font-medium border rounded-lg  focus:outline-none
              focus:border-black focus:ring-2 focus:ring-black"
          />
        ))}
      </div>

      {/* Tip Text */}
      {type === "email" && (
        <p className="text-sm text-gray-500 mb-6">
          Tip: Make sure to check your inbox and spam folders
        </p>
      )}

      <div className="flex flex-col gap-2">
        {/* Resend Button */}
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={timer > 0}
          className="w-fit rounded-2xl bg-gray-200 px-6 py-2 mb-2 hover:bg-gray-300"
        >
          {timer > 0
            ? `Resend code via ${
                type === "email" ? "email" : "SMS"
              } - 00:${timer.toString().padStart(2, "0")}`
            : `Resend code via ${type === "email" ? "email" : "SMS"}`}
        </button>

        {/* more options Button */}
        {isRegistered && (
          <>
            <button
              type="button"
              onClick={() => setIsMoreOptionsOpen(true)}
              className="w-fit rounded-2xl bg-gray-200 px-6 py-2  mb-2 hover:bg-gray-300"
            >
              More options
            </button>

            <MoreOptionsModal
              isOpen={isMoreOptionsOpen}
              onClose={() => setIsMoreOptionsOpen(false)}
              onOptionSelect={handleOptionSelect}
              loginType={type}
            />
          </>
        )}
      </div>

      {/* Additional Options */}
      {type === "phone" && (
        <button
          type="button"
          className="text-sm text-gray-600 hover:text-black mb-6 block"
        >
          Changed your mobile number?
        </button>
      )}

      {/* Navigation Buttons */}
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
          onClick={handleVerifyOTP}
          disabled={otp.join("").length !== 6 || loading}
          className={`px-6 py-2 rounded-2xl 
            ${
              otp.join("").length === 6 && !loading
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          {loading ? "Verifying..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
