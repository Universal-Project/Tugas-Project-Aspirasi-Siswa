import React from "react";

export type UserRole = "admin" | "siswa";

interface RoleTabSwitcherProps {
  activeRole: UserRole;
  onChange: (role: UserRole) => void;
}

export function RoleTabSwitcher({ activeRole, onChange }: RoleTabSwitcherProps) {
  return (
    <div className="w-full bg-white border border-[#CBD5E1] p-1 rounded-full flex items-center shadow-xs">
      <button
        type="button"
        onClick={() => onChange("siswa")}
        className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-200 text-center ${
          activeRole === "siswa"
            ? "gradient-cyan text-white shadow-sm"
            : "text-[#525252] hover:text-[#171717]"
        }`}
      >
        Murid / Siswa
      </button>
      <button
        type="button"
        onClick={() => onChange("admin")}
        className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-200 text-center ${
          activeRole === "admin"
            ? "gradient-cyan text-white shadow-sm"
            : "text-[#525252] hover:text-[#171717]"
        }`}
      >
        Admin
      </button>
    </div>
  );
}
