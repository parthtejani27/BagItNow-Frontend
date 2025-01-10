import React from "react";

const Input = ({
  type,
  placeholder,
  value,
  onChange,
  variant,
  size,
  disabled,
}) => {
  const baseClasses =
    "block w-full rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2";

  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses =
        "bg-theme-secondary text-theme-primary border border-theme-secondary focus:ring-accent-primary";
      break;
    case "secondary":
      variantClasses =
        "bg-theme-tertiary text-theme-primary border border-theme-secondary focus:ring-theme-secondary";
      break;
    default:
      variantClasses =
        "bg-theme-secondary text-theme-primary border border-theme-secondary focus:ring-accent-primary";
  }

  let sizeClasses = "";
  switch (size) {
    case "sm":
      sizeClasses = "px-3 py-1 text-sm";
      break;
    case "lg":
      sizeClasses = "px-6 py-3 text-lg";
      break;
    default:
      sizeClasses = "px-4 py-2";
  }

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses}`}
      disabled={disabled}
    />
  );
};

export default Input;

{
  /* <Input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={handleEmailChange}
  variant="secondary"
  size="lg"
/> */
}
