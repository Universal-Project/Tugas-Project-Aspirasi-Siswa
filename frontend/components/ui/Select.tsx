import React from "react";
import { ChevronDownIcon } from "./Icons";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export function Select({
  label,
  options,
  error,
  placeholder = "Pilih Opsi",
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id || props.name;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-[#404040]">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        <select
          id={selectId}
          className={`w-full appearance-none bg-white text-[#171717] text-sm rounded-full border border-[#CBD5E1] py-2.5 pl-5 pr-11 transition-all duration-200 focus:outline-none focus:border-[#009BE8] focus:ring-2 focus:ring-[#009BE8]/20 ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
          } ${className}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 text-[#A3A3A3] pointer-events-none">
          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </div>
      {error && <span className="text-xs text-red-600 pl-4">{error}</span>}
    </div>
  );
}
