import React from "react";

export function LiveBadge({ isLive = true }: { isLive?: boolean }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
      <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
      <span>{isLive ? "Laravel REST API Terhubung" : "Mode Mandiri (Offline Safe)"}</span>
    </div>
  );
}
