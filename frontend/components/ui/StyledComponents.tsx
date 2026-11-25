"use client";

import styled, { css } from "styled-components";
import { theme } from "@/lib/theme";

export type StatusAspirasi = "Menunggu" | "Proses" | "Selesai" | string;

// ==========================================
// BUTTONS
// ==========================================

export const Button = styled.button<{
  $variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  $size?: "sm" | "md" | "lg";
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  ${({ $size }) => {
    switch ($size) {
      case "sm":
        return css`
          padding: 6px 16px;
          font-size: 12px;
        `;
      case "lg":
        return css`
          padding: 12px 32px;
          font-size: 15px;
        `;
      default:
        return css`
          padding: 10px 24px;
          font-size: 13px;
        `;
    }
  }}

  ${({ $variant }) => {
    switch ($variant) {
      case "secondary":
        return css`
          background: ${theme.colors.navyDark};
          color: #ffffff;
          &:hover {
            background: ${theme.colors.navyBrand};
          }
        `;
      case "outline":
        return css`
          background: #ffffff;
          border-color: ${theme.colors.borderInput};
          color: ${theme.colors.textDark};
          &:hover {
            background: #f8fafc;
            border-color: ${theme.colors.cyanPrimary};
          }
        `;
      case "danger":
        return css`
          background: ${theme.colors.danger};
          color: #ffffff;
          &:hover {
            opacity: 0.9;
          }
        `;
      case "ghost":
        return css`
          background: transparent;
          color: ${theme.colors.textMuted};
          &:hover {
            background: rgba(0, 0, 0, 0.05);
            color: ${theme.colors.textDark};
          }
        `;
      default:
        return css`
          background: ${theme.gradients.cyan};
          color: #ffffff;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          &:hover {
            filter: brightness(1.05);
            transform: translateY(-1px);
          }
          &:active {
            transform: translateY(0);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
`;

// ==========================================
// FORM CONTROLS
// ==========================================

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #404040;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: #a3a3a3;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const Input = styled.input<{ $hasIcon?: boolean; $hasError?: boolean }>`
  width: 100%;
  padding: 10px 18px;
  padding-left: ${({ $hasIcon }) => ($hasIcon ? "46px" : "18px")};
  font-size: 13px;
  border-radius: ${theme.radii.input};
  border: 1px solid ${({ $hasError }) => ($hasError ? "#EF4444" : theme.colors.borderInput)};
  background: #ffffff;
  color: ${theme.colors.textDark};
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #a3a3a3;
  }

  &:focus {
    border-color: ${theme.colors.cyanPrimary};
    box-shadow: 0 0 0 3px rgba(0, 155, 232, 0.15);
  }
`;

export const Select = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 10px 18px;
  font-size: 13px;
  border-radius: ${theme.radii.input};
  border: 1px solid ${({ $hasError }) => ($hasError ? "#EF4444" : theme.colors.borderInput)};
  background: #ffffff;
  color: ${theme.colors.textDark};
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.cyanPrimary};
    box-shadow: 0 0 0 3px rgba(0, 155, 232, 0.15);
  }
`;

export const Textarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 14px 18px;
  font-size: 13px;
  border-radius: 16px;
  border: 1px solid ${({ $hasError }) => ($hasError ? "#EF4444" : theme.colors.borderInput)};
  background: #ffffff;
  color: ${theme.colors.textDark};
  outline: none;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 120px;

  &::placeholder {
    color: #a3a3a3;
  }

  &:focus {
    border-color: ${theme.colors.cyanPrimary};
    box-shadow: 0 0 0 3px rgba(0, 155, 232, 0.15);
  }
`;

export const ErrorText = styled.span`
  font-size: 11px;
  color: #ef4444;
  padding-left: 12px;
`;

// ==========================================
// BADGES
// ==========================================

export const StatusBadge = styled.span<{ $status: StatusAspirasi; $size?: "sm" | "md" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  border: 1px solid;
  padding: ${({ $size }) => ($size === "sm" ? "3px 10px" : "4px 14px")};
  font-size: ${({ $size }) => ($size === "sm" ? "11px" : "12px")};

  ${({ $status }) => {
    switch ($status) {
      case "Proses":
        return css`
          background: ${theme.colors.status.proses.bg};
          color: ${theme.colors.status.proses.text};
          border-color: ${theme.colors.status.proses.border};
        `;
      case "Selesai":
        return css`
          background: ${theme.colors.status.selesai.bg};
          color: ${theme.colors.status.selesai.text};
          border-color: ${theme.colors.status.selesai.border};
        `;
      default:
        return css`
          background: ${theme.colors.status.menunggu.bg};
          color: ${theme.colors.status.menunggu.text};
          border-color: ${theme.colors.status.menunggu.border};
        `;
    }
  }}
`;

// ==========================================
// ROLE TAB SWITCHER
// ==========================================

export const RoleSwitcherContainer = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid ${theme.colors.borderInput};
  border-radius: ${theme.radii.pill};
  padding: 4px;
  width: 100%;
`;

export const RoleTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  border: none;
  transition: all 0.2s ease;
  cursor: pointer;

  ${({ $active }) =>
    $active
      ? css`
          background: ${theme.gradients.cyan};
          color: #ffffff;
          box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
        `
      : css`
          background: transparent;
          color: #525252;
          &:hover {
            color: #171717;
          }
        `}
`;

// ==========================================
// CARDS & CONTAINERS
// ==========================================

export const Card = styled.div`
  background: ${theme.colors.cardSurface};
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: ${theme.radii.card};
  padding: 24px;
  box-shadow: ${theme.shadows.card};
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }
`;

export const StatCardWrapper = styled.div<{ $color?: "blue" | "amber" | "green" | "navy" }>`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: ${theme.radii.card};
  padding: 20px;
  box-shadow: ${theme.shadows.card};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  .stat-label {
    font-size: 11px;
    font-weight: 700;
    color: ${theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 30px;
    font-weight: 800;
    color: ${theme.colors.navyDark};
    margin-top: 4px;
  }

  .stat-badge {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 800;

    ${({ $color }) => {
      switch ($color) {
        case "amber":
          return css`
            background: ${theme.colors.status.menunggu.bg};
            color: ${theme.colors.status.menunggu.text};
            border: 1px solid ${theme.colors.status.menunggu.border};
          `;
        case "green":
          return css`
            background: ${theme.colors.status.selesai.bg};
            color: ${theme.colors.status.selesai.text};
            border: 1px solid ${theme.colors.status.selesai.border};
          `;
        case "navy":
          return css`
            background: ${theme.colors.navyDark};
            color: #ffffff;
          `;
        default:
          return css`
            background: ${theme.colors.status.proses.bg};
            color: ${theme.colors.status.proses.text};
            border: 1px solid ${theme.colors.status.proses.border};
          `;
      }
    }}
  }
`;
