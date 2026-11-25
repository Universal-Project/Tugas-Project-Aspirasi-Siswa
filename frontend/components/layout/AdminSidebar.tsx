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
   - Aside frame #523:571  — 256px wide, navy bg #001035
   - SidebarHeader #523:573 — logo + brand, border-bottom
   - Nav links #523:583     — column gap 4px
   - Bottom user card #523:595 — user name + logout button
   ============================================================ */

const Sidebar = styled.aside`
  width: 256px;
  min-height: 100vh;
  background-color: ${theme.colors.navyDark};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;

/* Logo + brand header */
const SidebarLogo = styled.div`
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;

  .brand-name {
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.3px;
    line-height: 1.2;
  }

  .brand-sub {
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.45);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 2px;
  }
`;

/* Nav section header */
const NavSection = styled.div`
  padding: 20px 16px 8px;

  .nav-label {
    font-size: 10px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    padding: 0 8px;
  }
`;

const Nav = styled.nav`
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  transition: all 0.18s ease;

  .nav-icon {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 15px;
    transition: all 0.18s ease;
  }

  .nav-text {
    display: flex;
    flex-direction: column;
  }

  .nav-title {
    font-size: 13px;
    font-weight: 700;
    line-height: 1.3;
  }

  .nav-desc {
    font-size: 10.5px;
    margin-top: 1px;
    line-height: 1.3;
  }

  ${({ $active }) =>
    $active
      ? `
      background: linear-gradient(135deg, #009BE8 0%, #0284C7 100%);
      box-shadow: 0 2px 8px rgba(0, 155, 232, 0.35);

      .nav-icon {
        background: rgba(255, 255, 255, 0.2);
        color: #ffffff;
      }
      .nav-title { color: #ffffff; }
      .nav-desc { color: rgba(255, 255, 255, 0.8); }
    `
      : `
      .nav-icon {
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.5);
      }
      .nav-title { color: rgba(255, 255, 255, 0.75); }
      .nav-desc { color: rgba(255, 255, 255, 0.35); }

      &:hover {
        background: rgba(255, 255, 255, 0.07);
        .nav-icon { 
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }
        .nav-title { color: #ffffff; }
        .nav-desc { color: rgba(255, 255, 255, 0.55); }
      }
    `}
`;

/* Bottom user card + logout */
const SidebarBottom = styled.div`
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const UserCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  .user-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #009BE8, #0284C7);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 800;
    color: #ffffff;
    flex-shrink: 0;
  }

  .user-info {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    font-size: 12px;
    font-weight: 800;
    color: #ffffff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-role {
    font-size: 10px;
    color: rgba(56, 189, 248, 0.9);
    font-weight: 600;
    margin-top: 1px;
  }
`;

const LogoutButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.18s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.4);
    color: #ef4444;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ---- Icon helpers ---- */
function IconDashboard() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconCategory() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const username =
    user && "username" in user && user.username ? user.username : "Administrator";
  const avatarLetter = username.charAt(0).toUpperCase();

  const navItems = [
    {
      href: "/admin/aspirasi",
      title: "Daftar Aspirasi",
      desc: "Kelola laporan masuk",
      icon: <IconDashboard />,
    },
    {
      href: "/admin/kategori",
      title: "Kelola Kategori",
      desc: "Kategori fasilitas API",
      icon: <IconCategory />,
    },
    {
      href: "/admin/riwayat",
      title: "Riwayat & Log",
      desc: "Audit histori aktivitas",
      icon: <IconHistory />,
    },
  ];

  return (
    <Sidebar>
      <SidebarTop>
        {/* Logo + Brand */}
        <SidebarLogo>
          <Image
            src="/assets/figma/logo-smk.png"
            alt="Logo SMK"
            width={36}
            height={36}
            style={{ objectFit: "contain" }}
          />
          <div>
            <div className="brand-name">SIPELAPOR</div>
            <div className="brand-sub">SMK Bhina Karya</div>
          </div>
        </SidebarLogo>

        {/* Nav */}
        <NavSection>
          <div className="nav-label">Manajemen</div>
        </NavSection>
        <Nav>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              $active={pathname === item.href}
            >
              <div className="nav-icon">{item.icon}</div>
              <div className="nav-text">
                <span className="nav-title">{item.title}</span>
                <span className="nav-desc">{item.desc}</span>
              </div>
            </NavItem>
          ))}
        </Nav>
      </SidebarTop>

      {/* User card + Logout */}
      <SidebarBottom>
        <UserCard>
          <div className="user-avatar">{avatarLetter}</div>
          <div className="user-info">
            <div className="user-name">{username}</div>
            <div className="user-role">Staf Sarana Sekolah</div>
          </div>
          <LogoutButton
            type="button"
            onClick={logout}
            title="Keluar dari akun"
          >
            <IconLogout />
          </LogoutButton>
        </UserCard>
      </SidebarBottom>
    </Sidebar>
  );
}
