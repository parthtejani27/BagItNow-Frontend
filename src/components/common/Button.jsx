import React from "react";

const Button = ({ children, variant, size, onClick, disabled }) => {
  const baseClasses =
    "inline-block rounded-lg font-medium transition-colors duration-200";

  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses =
        "bg-[var(--accent-primary)] text-[var(--background-primary)] hover:bg-[var(--accent-secondary)]";
      break;
    case "secondary":
      variantClasses =
        "bg-theme-secondary text-theme-primary hover:bg-theme-tertiary";
      break;
    case "outline":
      variantClasses =
        "border border-theme-secondary text-theme-primary hover:bg-theme-tertiary";
      break;
    default:
      variantClasses =
        "bg-theme-secondary text-theme-primary hover:bg-theme-tertiary";
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
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

{
  /* <Button variant="primary" size="lg" onClick={handleClick}>
  Click me!
</Button> */
}
