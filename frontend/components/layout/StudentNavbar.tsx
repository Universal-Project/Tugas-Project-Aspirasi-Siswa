"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";

/* ============================================================
   Figma Reference:
   - Header #523:1666  — sticky top, white bg, border-bottom
   - Nav links #523:1678 — pill active = cyan gradient
   - UserSection #523:1685 — nis info + logout pill button
   ============================================================ */

const NavHeader = styled.header`
  background: #ffffff;
  border-bottom: 1px solid ${theme.colors.borderSoft};
  position: sticky;
  top: 0;
  z-index: 40;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const NavInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  .brand-name {
    font-size: 15px;
    font-weight: 800;
    color: ${theme.colors.navyDark};
    letter-spacing: -0.4px;
  }

  .brand-badge {
    padding: 3px 10px;
    border-radius: ${theme.radii.pill};
    font-size: 11px;
    font-weight: 700;
    background: #e0f2fe;
    color: #0284c7;

    @media (max-width: 600px) {
      display: none;
    }
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 480px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  transition: all 0.18s ease;
  white-space: nowrap;

  ${({ $active }) =>
    $active
      ? `
      background: linear-gradient(135deg, #32BCFB 0%, #009BE8 100%);
      color: #ffffff;
      box-shadow: 0 1px 4px rgba(0, 155, 232, 0.3);
    `
      : `
      color: #525252;
      &:hover {
        background: #f1f5f9;
        color: #171717;
      }
    `}
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .nis {
    font-size: 12px;
    font-weight: 800;
    color: ${theme.colors.textDark};
    line-height: 1.3;
  }

  .kelas {
    font-size: 11px;
    color: ${theme.colors.textMuted};
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

const LogoutPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  border: 1.5px solid ${theme.colors.borderInput};
  background: #ffffff;
  color: #525252;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;

  &:hover {
    color: ${theme.colors.danger};
    border-color: #fca5a5;
    background: #fff5f5;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

function IconLogout() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function StudentNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/siswa/aspirasi/create", label: "Buat Pengaduan" },
    { href: "/siswa/riwayat", label: "Status Laporan" },
  ];

  return (
    <NavHeader>
      <NavInner>
        {/* Brand */}
        <Brand href="/siswa/riwayat">
          <Image
            src="/assets/figma/logo-smk.png"
            alt="Logo SMK"
            width={34}
            height={34}
            style={{ objectFit: "contain" }}
          />
          <span className="brand-name">SIPELAPOR</span>
          <span className="brand-badge">SMK Bhina Karya</span>
        </Brand>

        {/* Nav Links */}
        <NavLinks>
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              $active={pathname === link.href}
            >
              {link.label}
            </NavLink>
          ))}
        </NavLinks>

        {/* User + Logout */}
        <UserSection>
          {user && "nis" in user && (
            <UserInfo>
              <span className="nis">NIS {user.nis}</span>
              <span className="kelas">{user.kelas}</span>
            </UserInfo>
          )}
          <LogoutPill type="button" onClick={logout}>
            <IconLogout />
            Keluar
          </LogoutPill>
        </UserSection>
      </NavInner>
    </NavHeader>
  );
}
