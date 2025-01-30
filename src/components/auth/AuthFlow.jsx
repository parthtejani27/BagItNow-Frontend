import React from "react";
import { useSelector } from "react-redux";
import InitialStep from "./steps/InitialStep";
import OTPVerification from "./steps/OTPVerification";
import AdditionalContact from "./steps/AdditionalContact";
import PasswordStep from "./steps/PasswordStep";
import UserDetailsStep from "./steps/UserDetailsStep";
import PasswordLogin from "./steps/PasswordLogin";

const AuthFlow = () => {
  const { currentStep } = useSelector((state) => state.auth);

  const renderStep = () => {
    switch (currentStep) {
      case "INITIAL":
        return <InitialStep />;
      case "OTP_VERIFICATION":
        return <OTPVerification />;
      case "ADDITIONAL_INFO":
        return <AdditionalContact />;
      case "PASSWORD":
        return <PasswordStep />;
      case "USER_DETAILS":
        return <UserDetailsStep />;
      case "PASSWORD_LOGIN":
        return <PasswordLogin />;
      default:
        return <InitialStep />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full bg-black py-4">
        <div className="container mx-auto flex justify-start px-4">
          <span className="text-white text-2xl font-bold">
            BagIt <span className="text-green-500">Now</span>
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white">
        {renderStep()}
      </div>
    </div>
  );
};

export default AuthFlow;
