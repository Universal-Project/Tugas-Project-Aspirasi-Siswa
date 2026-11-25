"use client";

import React from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";

const FooterWrapper = styled.footer`
  background: #ffffff;
  border-top: 1px solid ${theme.colors.borderSoft};
  padding: 24px 20px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
  font-size: 12px;
  color: ${theme.colors.textMuted};

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`;

export function Footer() {
  return (
    <FooterWrapper>
      <FooterContent>
        <p>
          &copy; 2026 <strong>SMK Bhina Karya Karanganyar</strong> — Rekayasa Perangkat Lunak.
        </p>
        <p style={{ color: "#a3a3a3" }}>
          Sistem Pengaduan Sarana Sekolah (SIPELAPOR) • UKK RPL
        </p>
      </FooterContent>
    </FooterWrapper>
  );
}
