import React from "react";
import { ClockIcon, AlertCircleIcon, CheckCircleIcon } from "./Icons";

export type StatusAspirasi = "Menunggu" | "Proses" | "Selesai" | string;

interface StatusBadgeProps {
  status: StatusAspirasi;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const configs = {
    Menunggu: {
      bg: "bg-[#FEF3C7]",
      text: "text-[#D97706]",
      border: "border-[#FDE68A]",
      icon: <ClockIcon className="w-3.5 h-3.5" />,
    },
    Proses: {
      bg: "bg-[#E0F2FE]",
      text: "text-[#0284C7]",
      border: "border-[#BAE6FD]",
      icon: <AlertCircleIcon className="w-3.5 h-3.5" />,
    },
    Selesai: {
      bg: "bg-[#DCFCE7]",
      text: "text-[#16A34A]",
      border: "border-[#BBF7D0]",
      icon: <CheckCircleIcon className="w-3.5 h-3.5" />,
    },
  };

  const config = (configs as Record<string, any>)[status] || configs.Menunggu;

  const sizeClasses =
    size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3.5 py-1 text-xs font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.icon}
      <span>{status}</span>
    </span>
  );
}
