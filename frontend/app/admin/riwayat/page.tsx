"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { RotateCcwIcon, AlertTriangleIcon } from "@/components/ui/Icons";
import { aspirasiApi } from "@/lib/api";

type AspirasiReport = any;

/* ============================================================
   Figma Reference: Frame #523:113 "Riwayat & Pelacakan Status"
   - Aside 256px navy, main content fill
   - Top banner: title + badge "Audit Log"
   - Card list: white bg, border-radius 12px, divider rows
   ============================================================ */

const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${theme.colors.bgCanvas};
`;

const MainContent = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const TopBanner = styled.div`
  background: #ffffff;
  border-bottom: 1px solid ${theme.colors.borderSoft};
  padding: 24px 32px;
`;

const BannerTag = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: ${theme.colors.cyanPrimary};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
`;

const BannerTitle = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: ${theme.colors.navyDark};
  letter-spacing: -0.5px;
  margin-bottom: 4px;
`;

const BannerSub = styled.p`
  font-size: 13px;
  color: #6b7280;
`;

const PageBody = styled.div`
  flex: 1;
  padding: 24px 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NoticeBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #b91c1c;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToolbarCard = styled.div`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: 12px;
  padding: 12px 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 180px;
  max-width: 280px;

  input {
    width: 100%;
    padding: 7px 14px 7px 34px;
    font-size: 12px;
    border: 1px solid ${theme.colors.borderInput};
    border-radius: ${theme.radii.pill};
    background: #f9fafb;
    outline: none;
    font-family: inherit;
    color: ${theme.colors.textDark};
    transition: border-color 0.18s ease;

    &:focus {
      border-color: ${theme.colors.cyanPrimary};
      background: #fff;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  .icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }
`;

const DateInput = styled.input`
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: ${theme.radii.pill};
  border: 1.5px solid ${theme.colors.borderInput};
  background: #f9fafb;
  color: #374151;
  outline: none;
  font-family: inherit;
  transition: all 0.18s ease;

  &:focus {
    border-color: ${theme.colors.cyanPrimary};
    background: #fff;
    box-shadow: 0 0 0 2px rgba(0, 155, 232, 0.15);
  }
`;

const ResetBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  border: 1px dashed #ef4444;
  background: #fef2f2;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;

  &:hover {
    background: #fee2e2;
  }
`;

const AuditCard = styled.div`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const AuditCardHeader = styled.div`
  padding: 14px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 13px;
    font-weight: 800;
    color: ${theme.colors.navyDark};
  }

  span {
    font-size: 12px;
    color: ${theme.colors.textMuted};
  }
`;

const AuditRow = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafafa;
  }
`;

const RowTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;

const IdChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  background: ${theme.colors.navyDark};
  color: #ffffff;
  padding: 3px 10px;
  border-radius: 6px;
`;

const KategoriText = styled.strong`
  font-size: 13px;
  font-weight: 700;
  color: ${theme.colors.textDark};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: ${theme.radii.pill};
  border: 1px solid;

  ${({ $status }) => {
    switch ($status) {
      case "Proses":
        return `
          background: ${theme.colors.status.proses.bg};
          color: ${theme.colors.status.proses.text};
          border-color: ${theme.colors.status.proses.border};
        `;
      case "Selesai":
        return `
          background: ${theme.colors.status.selesai.bg};
          color: ${theme.colors.status.selesai.text};
          border-color: ${theme.colors.status.selesai.border};
        `;
      default:
        return `
          background: ${theme.colors.status.menunggu.bg};
          color: ${theme.colors.status.menunggu.text};
          border-color: ${theme.colors.status.menunggu.border};
        `;
    }
  }}
`;

const RowMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }
`;

const NisBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f1f5f9;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: ${theme.colors.navyDark};
`;

const RowDesc = styled.p`
  font-size: 13px;
  color: #374151;
  line-height: 1.6;
`;

const FeedbackBox = styled.div`
  padding: 10px 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.5;
  color: #166534;

  strong {
    display: block;
    margin-bottom: 2px;
    font-weight: 700;
  }
`;

const LoadingBox = styled.div`
  padding: 56px 24px;
  text-align: center;
  font-size: 13px;
  color: ${theme.colors.textMuted};
`;

/* Icons */
function IconLocation() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function AdminRiwayatPage() {
  const router = useRouter();
  const { isAuthenticated, role, isLoading: authLoading } = useAuth();

  const [reports, setReports] = useState<AspirasiReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || role !== "admin")) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, role, router]);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setApiError(null);
      try {
        const data = await aspirasiApi.getAll();
        setReports(data);
      } catch (err: unknown) {
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr.response?.status === 404) {
          setApiError(
            "Endpoint GET /api/aspirasi belum dibuat di routes/api.php backend Laravel (HTTP 404 Not Found)."
          );
        } else {
          setApiError("Gagal mengambil data histori dari server Laravel.");
        }
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    }
    if (isAuthenticated && role === "admin") load();
  }, [isAuthenticated, role]);

  const filteredReports = useMemo(() => {
    let r = [...reports];
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      r = r.filter((x) => new Date(x.created_at).getTime() >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86399999;
      r = r.filter((x) => new Date(x.created_at).getTime() <= to);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(
        (x) =>
          x.lokasi.toLowerCase().includes(q) ||
          x.keterangan.toLowerCase().includes(q) ||
          String(x.nis).includes(q) ||
          x.kategori?.ket_kategori?.toLowerCase().includes(q)
      );
    }
    return r;
  }, [reports, dateFrom, dateTo, searchQuery]);

  const hasActiveFilter = dateFrom !== "" || dateTo !== "" || searchQuery.trim() !== "";

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
  };

  return (
    <PageLayout>
      <AdminSidebar />

      <MainContent>
        <TopBanner>
          <BannerTag>Audit Log &amp; Histori Sistem</BannerTag>
          <BannerTitle>Riwayat &amp; Pelacakan Status Pengaduan</BannerTitle>
          <BannerSub>
            Rekam jejak seluruh aktivitas pelaporan fasilitas sarana di SMK Bhina Karya Karanganyar.
          </BannerSub>
        </TopBanner>

        <PageBody>
          {apiError && (
            <NoticeBox>
              <AlertTriangleIcon size={18} />
              <span>{apiError}</span>
            </NoticeBox>
          )}

          <ToolbarCard>
            <SearchBox>
              <svg className="icon" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari NIS, lokasi, keterangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBox>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Tgl:</span>
              <DateInput
                type="date"
                aria-label="Dari tanggal"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>—</span>
              <DateInput
                type="date"
                aria-label="Sampai tanggal"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            {hasActiveFilter && (
              <ResetBtn type="button" onClick={resetFilters}>
                <RotateCcwIcon size={12} />
                Reset
              </ResetBtn>
            )}
          </ToolbarCard>

          <AuditCard>
            <AuditCardHeader>
              <h2>Log Aktivitas Pengaduan</h2>
              <span>{filteredReports.length} dari {reports.length} total entri</span>
            </AuditCardHeader>

            {isLoading ? (
              <LoadingBox>Memuat histori log aktivitas...</LoadingBox>
            ) : filteredReports.length === 0 ? (
              <LoadingBox>
                {reports.length === 0
                  ? "Belum ada histori atau rekam jejak aktivitas pengaduan di sistem."
                  : "Tidak ada riwayat pengaduan yang cocok dengan filter pencarian."}
              </LoadingBox>
            ) : (
              filteredReports.map((report: any, idx: number) => {
                const input = report.input_aspirasi ?? report.inputAspirasi ?? {};
                const repId = report.id_pelaporan ?? report.id_aspirasi ?? report.id ?? idx;
                const currentStatus = report.status ?? report.aspirasi?.status ?? "Menunggu";
                const currentFeedback = report.feedback ?? report.aspirasi?.feedback;
                const currentKet = report.ket ?? report.keterangan ?? input.ket ?? input.keterangan ?? "-";
                const currentLokasi = report.lokasi ?? input.lokasi ?? "-";
                const currentNis = report.nis ?? input.nis ?? "-";
                const currentKelas = report.kelas ?? input.siswa?.kelas ?? "";
                const currentKategori = report.kategori?.ket_kategori ?? input.kategori?.ket_kategori ?? (report.id_kategori ? `Kategori #${report.id_kategori}` : "Fasilitas Sarpras");

                return (
                  <AuditRow key={repId}>
                    <RowTop>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <IdChip>#{repId}</IdChip>
                        <KategoriText>{currentKategori}</KategoriText>
                      </div>
                      <StatusBadge $status={currentStatus}>{currentStatus}</StatusBadge>
                    </RowTop>

                    <RowMeta>
                      <MetaItem style={{ color: theme.colors.cyanPrimary }}>
                        <IconLocation />
                        <span>{currentLokasi}</span>
                      </MetaItem>
                      <MetaItem>
                        <IconClock />
                        <span>
                          {new Date(report.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </MetaItem>
                      <NisBadge>
                        NIS {currentNis} {currentKelas ? `· ${currentKelas}` : ""}
                      </NisBadge>
                    </RowMeta>

                    <RowDesc>{currentKet}</RowDesc>

                    {currentFeedback && (
                      <FeedbackBox>
                        <strong>Respon Staf Sarpras:</strong>
                        {currentFeedback}
                      </FeedbackBox>
                    )}
                </AuditRow>
              );
            })
          )}
          </AuditCard>
        </PageBody>
      </MainContent>
    </PageLayout>
  );
}
