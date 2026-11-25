"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { StudentNavbar } from "@/components/layout/StudentNavbar";
import { Footer } from "@/components/layout/Footer";
import { ClipboardListIcon, LightbulbIcon, InfoCircleIcon, AlertTriangleIcon } from "@/components/ui/Icons";
import { kategoriApi, aspirasiApi } from "@/lib/api";

type Kategori = any;

/* ============================================================
   Figma Reference: Frame #523:1699 "Portal Siswa - Buat Laporan"
   - Hero section #523:1702 — white card, padding 40px, border-r 12px
   - Profile info banner #523:1728 — navy bg, row layout
   - 12-column grid #523:1750 — span-8 form, span-4 aside
   ============================================================ */

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${theme.colors.bgCanvas};
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* Hero banner matching Figma #523:1702 */
const HeroBanner = styled.div`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: 12px;
  padding: 32px 36px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;

  /* Subtle decorative blur — Figma #523:1703 */
  &::after {
    content: "";
    position: absolute;
    right: -40px;
    top: -40px;
    width: 200px;
    height: 200px;
    background: #cae6ff;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.35;
    pointer-events: none;
  }
`;

const HeroTag = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: ${theme.radii.pill};
  font-size: 11px;
  font-weight: 800;
  background: #e0f2fe;
  color: #0284c7;
  border: 1px solid #bae6fd;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
`;

const HeroTitle = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: ${theme.colors.navyDark};
  letter-spacing: -0.5px;
  margin-bottom: 6px;
`;

const HeroDesc = styled.p`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  max-width: 580px;
  margin-bottom: 16px;
`;

/* Student info ribbon — Figma #523:1728 navy bg */
const StudentRibbon = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: ${theme.colors.navyDark};
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;

  strong {
    font-weight: 800;
  }

  .sep {
    color: rgba(255, 255, 255, 0.35);
  }

  .kelas {
    color: #38bdf8;
    font-weight: 700;
  }
`;

/* 12-col grid: 8fr + 4fr */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 8fr 4fr;
  gap: 20px;
  align-items: start;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

/* ---- FORM CARD ---- */
const FormCard = styled.div`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const FormCardHeader = styled.div`
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;

  h2 {
    font-size: 14px;
    font-weight: 800;
    color: ${theme.colors.navyDark};
  }

  p {
    font-size: 11.5px;
    color: ${theme.colors.textMuted};
    margin-top: 2px;
  }
`;

const FormCardBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #374151;

  .required {
    color: #ef4444;
    margin-left: 2px;
  }
`;

const FieldSelect = styled.select`
  width: 100%;
  padding: 10px 16px;
  font-size: 13px;
  font-family: inherit;
  border: 1.5px solid ${theme.colors.borderInput};
  border-radius: 10px;
  background: #ffffff;
  color: ${theme.colors.textDark};
  outline: none;
  cursor: pointer;
  transition: border-color 0.18s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;

  &:focus {
    border-color: ${theme.colors.cyanPrimary};
    box-shadow: 0 0 0 3px rgba(0, 155, 232, 0.12);
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
  }
`;

const FieldInputWrapper = styled.div`
  position: relative;

  .field-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
    display: flex;
    align-items: center;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const FieldInput = styled.input<{ $hasIcon?: boolean }>`
  width: 100%;
  padding: 10px 16px;
  padding-left: ${({ $hasIcon }) => ($hasIcon ? "40px" : "16px")};
  font-size: 13px;
  font-family: inherit;
  border: 1.5px solid ${theme.colors.borderInput};
  border-radius: 10px;
  background: #ffffff;
  color: ${theme.colors.textDark};
  outline: none;
  transition: border-color 0.18s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: ${theme.colors.cyanPrimary};
    box-shadow: 0 0 0 3px rgba(0, 155, 232, 0.12);
  }
`;

const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  font-size: 13px;
  font-family: inherit;
  border: 1.5px solid ${theme.colors.borderInput};
  border-radius: 10px;
  background: #ffffff;
  color: ${theme.colors.textDark};
  outline: none;
  resize: vertical;
  min-height: 130px;
  line-height: 1.6;
  transition: border-color 0.18s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: ${theme.colors.cyanPrimary};
    box-shadow: 0 0 0 3px rgba(0, 155, 232, 0.12);
  }
`;

const CharCount = styled.div<{ $warn: boolean }>`
  font-size: 11px;
  color: ${({ $warn }) => ($warn ? "#ef4444" : theme.colors.textMuted)};
  text-align: right;
  margin-top: 2px;
`;

const AlertSuccess = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  font-size: 13px;
  color: #15803d;
  font-weight: 600;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

const AlertError = styled.div`
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-size: 13px;
  color: #b91c1c;
  font-weight: 600;
`;

const FormActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 4px;
  border-top: 1px solid #f1f5f9;
  margin-top: 4px;
`;

const BtnCancel = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  border: 1.5px solid ${theme.colors.borderInput};
  background: #ffffff;
  color: #374151;
  transition: all 0.18s ease;

  &:hover {
    border-color: ${theme.colors.navyDark};
    color: ${theme.colors.navyDark};
  }
`;

const BtnSubmit = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 24px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  border-radius: ${theme.radii.pill};
  border: none;
  background: linear-gradient(135deg, #32bcfb 0%, #009be8 100%);
  color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 155, 232, 0.3);
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

/* ---- ASIDE ---- */
const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AsideCard = styled.div<{ $variant?: "info" | "emergency" }>`
  background: ${({ $variant }) => ($variant === "emergency" ? "#eff6ff" : "#ffffff")};
  border: 1px solid ${({ $variant }) => ($variant === "emergency" ? "#bfdbfe" : theme.colors.borderSoft)};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  h3 {
    font-size: 13px;
    font-weight: 800;
    color: ${({ $variant }) => ($variant === "emergency" ? "#1d4ed8" : theme.colors.navyDark)};
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  ul {
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  li {
    font-size: 12px;
    color: #4b5563;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
    gap: 7px;

    &::before {
      content: "→";
      color: ${theme.colors.cyanPrimary};
      flex-shrink: 0;
      font-size: 11px;
      margin-top: 1px;
    }
  }

  p {
    font-size: 12px;
    color: ${({ $variant }) => ($variant === "emergency" ? "#1e40af" : "#4b5563")};
    line-height: 1.6;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Step = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .step-num {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${({ $active }) => ($active ? theme.colors.cyanPrimary : "#e5e7eb")};
    color: ${({ $active }) => ($active ? "#ffffff" : "#9ca3af")};
    font-size: 11px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    transition: all 0.2s ease;
  }

  .step-label {
    font-size: 12px;
    font-weight: 700;
    color: ${({ $active }) => ($active ? theme.colors.navyDark : "#9ca3af")};
    line-height: 1.4;
  }

  .step-desc {
    font-size: 11px;
    color: ${theme.colors.textMuted};
    margin-top: 1px;
  }
`;

/* ---- ICONS ---- */
function IconLocation() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconWarning() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

// Active step based on form progress
function getActiveStep(kategori: string, lokasi: string, keterangan: string) {
  if (!kategori) return 1;
  if (!lokasi) return 2;
  if (!keterangan) return 3;
  return 4;
}

const MAX_KETERANGAN = 500;

export default function CreateAspirasiPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const [isLoadingKategori, setIsLoadingKategori] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  // Load kategori (cached in api.ts)
  const loadKategori = useCallback(async () => {
    setIsLoadingKategori(true);
    const data = await kategoriApi.getAll();
    setKategoris(data);
    if (data.length > 0 && !selectedKategori) {
      const firstId = data[0].id_kategori ?? data[0].id;
      if (firstId) setSelectedKategori(String(firstId));
    }
    setIsLoadingKategori(false);
  }, [selectedKategori]);

  useEffect(() => {
    loadKategori();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedKategori || !lokasi.trim() || !keterangan.trim()) {
      setErrorMsg("Semua kolom wajib diisi sebelum mengirim laporan.");
      return;
    }
    if (keterangan.trim().length < 20) {
      setErrorMsg("Keterangan terlalu singkat — mohon jelaskan kondisi kerusakan minimal 20 karakter.");
      return;
    }

    setIsSubmitting(true);
    const studentUser = user && "nis" in user ? user : undefined;

    try {
      await aspirasiApi.create({
        kategori_id: Number(selectedKategori),
        lokasi: lokasi.trim(),
        keterangan: keterangan.trim(),
        nis: studentUser?.nis,
        kelas: studentUser?.kelas,
      });

      setSuccessMsg("Laporan berhasil terkirim!");
      setTimeout(() => router.push("/siswa/riwayat"), 1500);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      const status = axiosErr.response?.status;
      const serverMsg = axiosErr.response?.data?.message;

      if (status === 404) {
        setErrorMsg("Error HTTP 404: Endpoint POST /api/siswa/aspirasi tidak ditemukan di routes/api.php.");
      } else if (status === 422) {
        setErrorMsg(`Validasi gagal (422): ${serverMsg || "Periksa form input Anda."}`);
      } else if (status === 401) {
        setErrorMsg("Sesi login berakhir (401). Silakan login ulang.");
      } else if (status === 500) {
        setErrorMsg(`Error Backend Laravel (500): ${serverMsg || "Terjadi kendala internal di Laravel. Periksa storage/logs/laravel.log"}`);
      } else {
        setErrorMsg(serverMsg || axiosErr.message || "Gagal menghubungi server.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStep = getActiveStep(selectedKategori, lokasi, keterangan);
  const keteranganLen = keterangan.length;

  return (
    <PageWrapper>
      <StudentNavbar />

      <MainContent>
        {/* Hero Banner */}
        <HeroBanner>
          <HeroTag>Formulir Pengaduan Sarana</HeroTag>
          <HeroTitle>Sampaikan Aspirasi Fasilitas</HeroTitle>
          <HeroDesc>
            Bantu kami memelihara fasilitas belajar di SMK Bhina Karya Karanganyar agar tetap aman,
            nyaman, dan mendukung kegiatan praktik kejuruan.
          </HeroDesc>

          {user && "nis" in user && (
            <StudentRibbon>
              <span>Pelapor:</span>
              <strong>NIS {user.nis}</strong>
              <span className="sep">•</span>
              <span className="kelas">{user.kelas}</span>
            </StudentRibbon>
          )}
        </HeroBanner>

        {/* Main Grid */}
        <Grid>
          {/* Left: Form */}
          <FormCard>
            <FormCardHeader>
              <h2>Detail Fasilitas yang Dilaporkan</h2>
              <p>Isi semua kolom dengan informasi yang akurat untuk memudahkan penanganan.</p>
            </FormCardHeader>

            <FormCardBody>
              {successMsg && (
                <AlertSuccess>
                  <IconCheck />
                  <span>{successMsg}</span>
                </AlertSuccess>
              )}
              {errorMsg && (
                <AlertError>
                  <AlertTriangleIcon size={16} />
                  <span>{errorMsg}</span>
                </AlertError>
              )}

              <form
                id="form-laporan"
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "18px" }}
              >
                {/* Kategori */}
                <FormGroup>
                  <FieldLabel htmlFor="kategori">
                    Kategori Sarana / Prasarana <span className="required">*</span>
                  </FieldLabel>
                  <FieldSelect
                    id="kategori"
                    value={selectedKategori}
                    onChange={(e) => setSelectedKategori(e.target.value)}
                    disabled={isLoadingKategori || kategoris.length === 0}
                    required
                  >
                    <option value="">
                      {isLoadingKategori
                        ? "Memuat kategori dari server..."
                        : kategoris.length === 0
                        ? "Belum ada kategori sarana di server"
                        : "-- Pilih Kategori Sarana --"}
                    </option>
                    {kategoris.map((k: any, idx: number) => {
                      const catId = k.id_kategori ?? k.id ?? idx;
                      return (
                        <option key={catId} value={catId}>
                          {k.ket_kategori}
                        </option>
                      );
                    })}
                  </FieldSelect>
                  {!isLoadingKategori && kategoris.length === 0 && (
                    <span style={{ fontSize: "11px", color: "#d97706", marginTop: "4px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <InfoCircleIcon size={14} />
                      Belum ada kategori yang dibuat di database Laravel. Admin dapat menambahkannya di menu Kelola Kategori.
                    </span>
                  )}
                </FormGroup>

                {/* Lokasi */}
                <FormGroup>
                  <FieldLabel htmlFor="lokasi">
                    Lokasi Spesifik Sarana <span className="required">*</span>
                  </FieldLabel>
                  <FieldInputWrapper>
                    <div className="field-icon">
                      <IconLocation />
                    </div>
                    <FieldInput
                      id="lokasi"
                      $hasIcon
                      type="text"
                      placeholder="Contoh: Lab RPL 2 (PC-09), Toilet Lt. 2 Gedung B"
                      value={lokasi}
                      onChange={(e) => setLokasi(e.target.value)}
                      maxLength={150}
                      required
                    />
                  </FieldInputWrapper>
                </FormGroup>

                {/* Keterangan */}
                <FormGroup>
                  <FieldLabel htmlFor="keterangan">
                    Keterangan Kerusakan / Pengaduan <span className="required">*</span>
                  </FieldLabel>
                  <FieldTextarea
                    id="keterangan"
                    rows={5}
                    placeholder="Jelaskan kondisi kerusakan sarana, sejak kapan terjadi, dan dampaknya terhadap kegiatan belajar..."
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value.slice(0, MAX_KETERANGAN))}
                    required
                  />
                  <CharCount $warn={keteranganLen > MAX_KETERANGAN - 50}>
                    {keteranganLen} / {MAX_KETERANGAN} karakter
                  </CharCount>
                </FormGroup>
              </form>

              {/* Actions */}
              <FormActions>
                <BtnCancel href="/siswa/riwayat">← Kembali</BtnCancel>
                <BtnSubmit
                  type="submit"
                  form="form-laporan"
                  disabled={isSubmitting || !!successMsg}
                >
                  <IconSend />
                  {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
                </BtnSubmit>
              </FormActions>
            </FormCardBody>
          </FormCard>

          {/* Right: Aside */}
          <Aside>
            {/* Step Indicator */}
            <AsideCard>
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ClipboardListIcon size={18} />
                Langkah Pengisian
              </h3>
              <StepIndicator>
                {[
                  { label: "Pilih Kategori", desc: "Tentukan jenis fasilitas yang rusak" },
                  { label: "Isi Lokasi", desc: "Nomor ruang, gedung, atau area spesifik" },
                  { label: "Tulis Keterangan", desc: "Deskripsi kerusakan minimal 20 karakter" },
                  { label: "Kirim Laporan", desc: "Laporan diteruskan ke tim Sarpras" },
                ].map((step, i) => (
                  <Step key={i} $active={activeStep >= i + 1}>
                    <div className="step-num">{i + 1}</div>
                    <div>
                      <div className="step-label">{step.label}</div>
                      <div className="step-desc">{step.desc}</div>
                    </div>
                  </Step>
                ))}
              </StepIndicator>
            </AsideCard>

            {/* Tips */}
            <AsideCard>
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <LightbulbIcon size={18} />
                Tips Pelaporan
              </h3>
              <ul>
                <li>Sebutkan nomor ruangan, nomor meja, atau nomor komputer secara spesifik</li>
                <li>Hindari laporan ganda untuk kerusakan yang sama</li>
                <li>Gunakan bahasa yang sopan dan mudah dipahami</li>
                <li>Pantau status di halaman <strong>Status Laporan</strong></li>
              </ul>
            </AsideCard>

            {/* Emergency */}
            <AsideCard $variant="emergency">
              <h3>
                <IconWarning />
                Kondisi Darurat?
              </h3>
              <p>
                Untuk korsleting listrik aktif atau kebocoran pipa air utama,
                segera temui <strong>staf Sarpras piket</strong> di Ruang Tata Usaha atau hubungi guru piket.
              </p>
            </AsideCard>
          </Aside>
        </Grid>
      </MainContent>

      <Footer />
    </PageWrapper>
  );
}
