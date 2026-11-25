"use client";

import React, { useEffect } from "react";
import { CloseIcon } from "./Icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur matching Figma #523:839 */}
      <div
        className="fixed inset-0 bg-[#001035]/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />
      {/* Modal Dialog Content */}
      <div className="relative z-10 bg-white rounded-2xl shadow-modal max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#E2E8F0] animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
          <div>
            <h3 className="text-base font-bold text-[#001035]">{title}</h3>
            {subtitle && <p className="text-xs text-[#737373] mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#737373] hover:text-[#171717] hover:bg-black/5 transition-colors"
            aria-label="Tutup"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
