import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthFlow from "../components/auth/AuthFlow";

const Auth = () => {
  const { token } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <AuthFlow />
    </>
  );
};

export default Auth;
