"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/StyledComponents";

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.bgCanvas};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.header`
  background: #ffffff;
  border-bottom: 1px solid ${theme.colors.borderSoft};
  padding: 14px 24px;
`;

const HeaderContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;

  .title {
    font-size: 16px;
    font-weight: 800;
    color: ${theme.colors.navyDark};
    letter-spacing: -0.5px;
  }

  .subtitle {
    font-size: 11px;
    font-weight: 600;
    color: ${theme.colors.cyanPrimary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const Hero = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  border-radius: ${theme.radii.pill};
  font-size: 11px;
  font-weight: 700;
  background: #e0f2fe;
  color: ${theme.colors.cyanPrimary};
  border: 1px solid #bae6fd;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Heading = styled.h1`
  font-size: 38px;
  font-weight: 800;
  color: ${theme.colors.navyDark};
  letter-spacing: -1px;
  line-height: 1.2;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

const Paragraph = styled.p`
  font-size: 15px;
  color: #525252;
  line-height: 1.6;
  max-width: 650px;

  strong {
    color: ${theme.colors.navyDark};
  }
`;

const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
`;

const Footer = styled.footer`
  background: #ffffff;
  border-top: 1px solid ${theme.colors.borderSoft};
  padding: 20px 24px;
  text-align: center;
  font-size: 12px;
  color: ${theme.colors.textMuted};
`;

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (role === "admin") {
        router.push("/admin/aspirasi");
      } else if (role === "siswa") {
        router.push("/siswa/riwayat");
      }
    }
  }, [isAuthenticated, role, isLoading, router]);

  return (
    <PageContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <Brand>
            <Image
              src="/assets/figma/logo-smk.png"
              alt="Logo SMK Bhina Karya"
              width={38}
              height={38}
              priority
              style={{ objectFit: "contain" }}
            />
            <BrandText>
              <span className="title">SIPELAPOR</span>
              <span className="subtitle">SMK Bhina Karya</span>
            </BrandText>
          </Brand>
          <Link href="/login">
            <Button $variant="primary" $size="sm">
              Masuk Aplikasi
            </Button>
          </Link>
        </HeaderContent>
      </Header>

      {/* Hero Section */}
      <Hero>
        <Image
          src="/assets/figma/logo-smk.png"
          alt="Emblem SMK Bhina Karya"
          width={120}
          height={120}
          priority
          style={{ objectFit: "contain", marginBottom: "8px" }}
        />

        <Badge>Portal Resmi Pengaduan Sarana & Prasarana</Badge>

        <Heading>Sistem Informasi Pengaduan & Aspirasi Siswa</Heading>

        <Paragraph>
          Wadah aspirasi terpadu siswa <strong>SMK Bhina Karya Karanganyar</strong> untuk melaporkan
          kebutuhan perbaikan fasilitas, sarana belajar, dan ruang praktik secara transparan dan
          terpantau.
        </Paragraph>

        <ActionGroup>
          <Link href="/login">
            <Button $variant="primary" $size="lg">
              Mulai Sampaikan Aspirasi
            </Button>
          </Link>
          <Link href="/login">
            <Button $variant="secondary" $size="lg">
              Login Administrator
            </Button>
          </Link>
        </ActionGroup>
      </Hero>

      {/* Footer */}
      <Footer>
        &copy; 2026 SMK Bhina Karya Karanganyar • UKK Rekayasa Perangkat Lunak
      </Footer>
    </PageContainer>
  );
}
