import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const variantStyles = {
    primary:
      "gradient-cyan text-white shadow-sm hover:brightness-105 active:scale-[0.98] focus:ring-[#009BE8]",
    secondary:
      "bg-[#001035] text-white hover:bg-[#02235E] active:scale-[0.98] focus:ring-[#001035]",
    outline:
      "bg-white border border-[#CBD5E1] text-[#171717] hover:bg-[#F8FAFC] active:scale-[0.98] focus:ring-[#009BE8]",
    danger:
      "bg-[#DE0B1B] text-white hover:bg-[#b80816] active:scale-[0.98] focus:ring-[#DE0B1B]",
    ghost:
      "bg-transparent text-[#737373] hover:text-[#171717] hover:bg-black/5 active:scale-[0.98]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Memproses...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
