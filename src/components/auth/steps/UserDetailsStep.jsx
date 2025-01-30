// src/components/auth/steps/UserDetailsStep.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTempUserData,
  register,
  setCurrentStep,
} from "../../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const UserDetailsStep = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, tempUserData } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Combine with existing temp data and register
      await dispatch(
        register({
          userId: tempUserData._id,
          firstName: formData.firstName,
          lastName: formData.lastName,
        })
      ).unwrap();

      dispatch(clearTempUserData());
      navigate("/");

      // Registration successful - user will be redirected
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleBack = () => {
    dispatch(setCurrentStep("INITIAL"));
  };

  return (
    <div className="w-full max-w-md mx-auto px-6">
      {/* Title */}
      <h1 className="text-2xl font-medium mb-2">What&apos;s your name?</h1>

      {/* Subtitle */}
      <p className="text-gray-600 mb-6">
        Let us know how to properly address you
      </p>

      {/* Form */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* First Name Input */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
            First name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Last Name Input */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Error Display */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

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
            disabled={!formData.firstName || !formData.lastName || loading}
            className={`px-6 py-2 rounded-2xl 
              ${
                !formData.firstName || !formData.lastName || loading
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

export default UserDetailsStep;
