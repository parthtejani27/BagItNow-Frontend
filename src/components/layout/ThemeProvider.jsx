import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectDarkMode, setDarkMode } from "../../store/slices/appSlice";

const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectDarkMode);

  useEffect(() => {
    // Apply dark mode class to html element
    const root = window.document.documentElement;

    if (isDarkMode) {
      root.classList.add("dark");
      // Also set meta theme-color for mobile browsers
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "#111827");
    } else {
      root.classList.remove("dark");
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "#ffffff");
    }
  }, [isDarkMode]);

  // System theme detection
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (!localStorage.getItem("darkMode")) {
        dispatch(setDarkMode(e.matches));
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary">
      {children}
    </div>
  );
};

export default ThemeProvider;
