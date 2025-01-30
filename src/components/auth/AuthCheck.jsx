import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { selectToken, selectIsRefreshing } from "../../store/slices/authSlice";
import LoadingScreen from "../common/LoadingScreen";

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector(selectToken);
  const isRefreshing = useSelector(selectIsRefreshing);

  // Routes configuration
  const protectedRoutes = [
    "/profile",
    "/orders",
    "/checkout",
    "/wishlist",
    "/addresses",
    "/payment-methods",
    "/account-settings",
    "/my-reviews",
    "/notifications",
  ];

  const authOnlyRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  const isProtectedRoute = (pathname) => {
    return protectedRoutes.some((route) => pathname.startsWith(route));
  };

  const isAuthOnlyRoute = (pathname) => {
    return authOnlyRoutes.some((route) => pathname.startsWith(route));
  };

  useEffect(() => {
    // Handle auth-only routes (login, register, etc.)
    if (isAuthOnlyRoute(location.pathname) && token) {
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
      return;
    }

    // Handle protected routes
    if (isProtectedRoute(location.pathname) && !token) {
      navigate("/auth", {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }
  }, [token, location.pathname, navigate, location.state]);

  if (isRefreshing) {
    return <LoadingScreen />;
  }

  return children;
};

export default AuthCheck;
