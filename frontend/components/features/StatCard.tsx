import React from "react";

interface StatCardProps {
  title: string;
  count: number;
  subtitle?: string;
  color?: "blue" | "amber" | "green" | "navy";
}

export function StatCard({ title, count, subtitle, color = "blue" }: StatCardProps) {
  const colorMap = {
    blue: "border-[#BAE6FD] bg-[#E0F2FE]/40 text-[#0284C7]",
    amber: "border-[#FDE68A] bg-[#FEF3C7]/40 text-[#D97706]",
    green: "border-[#BBF7D0] bg-[#DCFCE7]/40 text-[#16A34A]",
    navy: "border-[#001035]/20 bg-[#001035] text-white",
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-card flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-bold text-[#737373] tracking-wide uppercase">{title}</p>
        <p className="text-3xl font-extrabold text-[#001035] mt-1">{count}</p>
        {subtitle && <p className="text-[11px] text-[#A3A3A3] mt-0.5">{subtitle}</p>}
      </div>
      <div
        className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-bold text-lg ${colorMap[color]}`}
      >
        {count}
      </div>
    </div>
  );
}
