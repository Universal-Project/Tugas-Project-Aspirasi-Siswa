import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./Icons";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export function Input({
  label,
  icon,
  error,
  type = "text",
  className = "",
  id,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || props.name;
  const isPassword = type === "password";

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[#404040]">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-4 text-[#A3A3A3] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`w-full bg-white text-[#171717] placeholder-[#A3A3A3] text-sm rounded-full border border-[#CBD5E1] py-2.5 transition-all duration-200 focus:outline-none focus:border-[#009BE8] focus:ring-2 focus:ring-[#009BE8]/20 ${
            icon ? "pl-11" : "pl-5"
          } ${isPassword ? "pr-11" : "pr-5"} ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-[#A3A3A3] hover:text-[#404040] focus:outline-none"
            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
          >
            {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-600 pl-4">{error}</span>}
    </div>
  );
}
