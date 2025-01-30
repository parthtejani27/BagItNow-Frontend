import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-theme-primary">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>
    </div>
  );
};

export default LoadingScreen;
