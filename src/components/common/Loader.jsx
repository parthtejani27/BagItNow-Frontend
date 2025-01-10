import React from "react";

const Loader = ({ size, color }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const colorClasses = {
    primary: "border-t-accent-primary",
    secondary: "border-t-accent-secondary",
    white: "border-t-white",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-2 border-solid ${sizeClasses[size]} ${colorClasses[color]}`}
        style={{ borderTopColor: "transparent" }}
      ></div>
    </div>
  );
};

Loader.defaultProps = {
  size: "md",
  color: "primary",
};

export default Loader;

{
  /* <Loader size="lg" color="secondary" /> */
}
