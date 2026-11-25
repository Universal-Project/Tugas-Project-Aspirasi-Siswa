"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { useAuth, UserRole } from "@/context/AuthContext";
import {
  Button,
  FormGroup,
  Label,
  Input,
  Select,
  RoleSwitcherContainer,
  RoleTab,
  InputWrapper,
  InputIcon,
} from "@/components/ui/StyledComponents";
import { UserIcon, LockIcon } from "@/components/ui/Icons";

const LoginContainer = styled.div`
  min-height: 100vh;
  background-color: #2d2d2d;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const SplitCard = styled.div`
  background: #ffffff;
  border-radius: 28px;
  box-shadow: ${theme.shadows.modal};
  max-width: 900px;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 5fr 7fr;
  min-height: 560px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BannerSection = styled.div`
  background: ${theme.gradients.brand};
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;

  .glow {
    position: absolute;
    width: 250px;
    height: 250px;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 50%;
    filter: blur(50px);
    pointer-events: none;
  }

  .emblem-wrapper {
    position: relative;
    z-index: 1;
    margin-bottom: 20px;
    filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.35));
  }

  .banner-title {
    position: relative;
    z-index: 1;
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.5px;
  }

  .banner-subtitle {
    position: relative;
    z-index: 1;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 4px;
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const FormSection = styled.div`
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;

  .form-inner {
    max-width: 360px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .badge-admin {
    display: inline-block;
    padding: 3px 10px;
    background: #e0f2fe;
    color: #0369a1;
    font-size: 10px;
    font-weight: 800;
    border-radius: 9999px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    align-self: flex-start;
  }

  .title {
    font-size: 26px;
    font-weight: 800;
    color: ${theme.colors.textDark};
    letter-spacing: -0.5px;
  }

  .subtitle {
    font-size: 13px;
    color: ${theme.colors.textMuted};
    margin-top: 4px;
    line-height: 1.4;

    strong {
      color: ${theme.colors.navyDark};
    }
  }

  .error-box {
    padding: 10px 14px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
    border-radius: 12px;
    font-size: 12px;
  }

  .footer-hint {
    text-align: center;
    font-size: 11px;
    color: ${theme.colors.textMuted};
    margin-top: 4px;
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const KELAS_OPTIONS = [
  "X PPLG 1",
  "X PPLG 2",
  "XI PPLG 1",
  "XI PPLG 2",
  "XII PPLG 1",
  "XII PPLG 2",
  "X TJKT 1",
  "XI TJKT 1",
  "XII TJKT 1",
  "X TO 1",
  "XI TO 1",
  "XII TO 1",
];

export default function LoginPage() {
  const router = useRouter();
  const { loginAdmin, loginSiswa, isLoading: authLoading } = useAuth();

  const [role, setRole] = useState<UserRole>("siswa");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Default values from UserSeeder for easy testing
  const [nis, setNis] = useState("123456");
  const [kelas, setKelas] = useState("XI PPLG 1");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (role === "siswa") {
        if (!nis.trim() || !kelas) {
          setErrorMessage("NIS dan Kelas wajib diisi.");
          setIsSubmitting(false);
          return;
        }
        const res = await loginSiswa(nis.trim(), kelas);
        if (res.success) {
          router.push("/siswa/riwayat");
        } else {
          setErrorMessage(res.message || "NIS atau Kelas salah.");
        }
      } else {
        if (!username.trim() || !password) {
          setErrorMessage("Username dan Password wajib diisi.");
          setIsSubmitting(false);
          return;
        }
        const res = await loginAdmin(username.trim(), password);
        if (res.success) {
          router.push("/admin/aspirasi");
        } else {
          setErrorMessage(res.message || "Username atau password salah.");
        }
      }
    } catch {
      setErrorMessage("Koneksi gagal ke server REST API Laravel.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <SplitCard>
        {/* Left Side: Figma Gradient Banner */}
        <BannerSection>
          <div className="glow" />
          <div className="emblem-wrapper">
            <Image
              src="/assets/figma/logo-smk.png"
              alt="Lambang SMK Bhina Karya Karanganyar"
              width={180}
              height={180}
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
          <h2 className="banner-title">SMK BHINA KARYA</h2>
          <p className="banner-subtitle">Karanganyar • Rekayasa Perangkat Lunak</p>
        </BannerSection>

        {/* Right Side: Credentials & Switcher */}
        <FormSection>
          <div className="form-inner">
            <div>
              {role === "admin" && (
                <span className="badge-admin">Panel Administrator</span>
              )}
              <h1 className="title">
                {role === "siswa" ? "Selamat Datang!" : "Selamat Datang Admin!"}
              </h1>
              <p className="subtitle">
                {role === "siswa" ? (
                  <>
                    Login untuk menyampaikan aspirasi di <strong>SMK BHINA KARYA</strong>
                  </>
                ) : (
                  <>
                    Masuk ke panel manajemen pengaduan <strong>SMK BHINA KARYA</strong>
                  </>
                )}
              </p>
            </div>

            {/* Role Switcher Pill */}
            <RoleSwitcherContainer>
              <RoleTab
                type="button"
                $active={role === "siswa"}
                onClick={() => setRole("siswa")}
              >
                Murid / Siswa
              </RoleTab>
              <RoleTab
                type="button"
                $active={role === "admin"}
                onClick={() => setRole("admin")}
              >
                Admin
              </RoleTab>
            </RoleSwitcherContainer>

            {errorMessage && <div className="error-box">{errorMessage}</div>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {role === "siswa" ? (
                <>
                  <FormGroup>
                    <Label htmlFor="nis">Nomor Induk Siswa (NIS)</Label>
                    <InputWrapper>
                      <InputIcon>
                        <UserIcon className="w-5 h-5" />
                      </InputIcon>
                      <Input
                        id="nis"
                        $hasIcon
                        placeholder="Masukkan NIS (cth: 123456)"
                        value={nis}
                        onChange={(e) => setNis(e.target.value)}
                        required
                      />
                    </InputWrapper>
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="kelas">Pilih Kelas</Label>
                    <Select
                      id="kelas"
                      value={kelas}
                      onChange={(e) => setKelas(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Pilih Kelas
                      </option>
                      {KELAS_OPTIONS.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                </>
              ) : (
                <>
                  <FormGroup>
                    <Label htmlFor="username">Username Administrator</Label>
                    <InputWrapper>
                      <InputIcon>
                        <UserIcon className="w-5 h-5" />
                      </InputIcon>
                      <Input
                        id="username"
                        $hasIcon
                        placeholder="Username (cth: admin)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </InputWrapper>
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="password">Kata Sandi</Label>
                    <InputWrapper>
                      <InputIcon>
                        <LockIcon className="w-5 h-5" />
                      </InputIcon>
                      <Input
                        id="password"
                        type="password"
                        $hasIcon
                        placeholder="Kata Sandi (cth: admin123)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </InputWrapper>
                  </FormGroup>
                </>
              )}

              <Button
                type="submit"
                $variant="primary"
                $size="lg"
                $fullWidth
                disabled={isSubmitting || authLoading}
                style={{ marginTop: "8px" }}
              >
                {isSubmitting ? "Memproses..." : role === "siswa" ? "Masuk ke Portal Siswa" : "Masuk sebagai Admin"}
              </Button>

              <p className="footer-hint">
                {role === "siswa"
                  ? "Akun siswa terdaftar sesuai data UKK SMK Bhina Karya"
                  : "Akses khusus pengelola sarpras & kesiswaan"}
              </p>
            </form>
          </div>
        </FormSection>
      </SplitCard>
    </LoginContainer>
  );
}
