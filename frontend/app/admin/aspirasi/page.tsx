"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { ReportCard } from "@/components/features/ReportCard";
import { StatusChangeModal } from "@/components/features/StatusChangeModal";
import { FeedbackModal } from "@/components/features/FeedbackModal";
import { CheckCircleIcon, RotateCcwIcon, CloseIcon, AlertTriangleIcon } from "@/components/ui/Icons";
import { aspirasiApi, kategoriApi } from "@/lib/api";

type StatusAspirasi = "Menunggu" | "Proses" | "Selesai" | string;
type AspirasiReport = any;
type Kategori = any;

/* ============================================================
   Figma Reference: Frame #523:603 "Laporan Masuk & Preview"
   - Layout: 256px aside + fill main content
   - Top banner: white bg, border-bottom, stat chips
   - Filter toolbar: white card, border-radius 12px
   - Data table: white card, border-radius 12px, column list
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

/* ---- Top Banner (Figma #523:606) ---- */
const TopBanner = styled.div`
  background: #ffffff;
  border-bottom: 1px solid ${theme.colors.borderSoft};
  padding: 24px 32px 0;
`;

const BannerTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 4px;

  h1 {
    font-size: 22px;
    font-weight: 800;
    color: ${theme.colors.navyDark};
    letter-spacing: -0.5px;
  }
`;

const LiveDot = styled.span<{ $live: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: ${theme.radii.pill};
  background: ${({ $live }) => ($live ? "#dcfce7" : "#fef9c3")};
  color: ${({ $live }) => ($live ? "#16a34a" : "#a16207")};

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    display: inline-block;
  }
`;

const BannerSub = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 20px;
`;

/* ---- Stat Chips (Figma #523:618 Bento style) ---- */
const StatChips = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 0;
`;

const StatChip = styled.div<{ $color: "navy" | "amber" | "blue" | "green" }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 12px 12px 0 0;
  border: 1px solid;
  border-bottom: none;
  min-width: 120px;
  position: relative;
  bottom: -1px;
  transition: transform 0.15s ease;

  ${({ $color }) => {
    switch ($color) {
      case "navy":
        return `
          background: ${theme.colors.navyDark};
          border-color: ${theme.colors.navyDark};
          color: #ffffff;
          .chip-num { color: #ffffff; }
          .chip-label { color: rgba(255,255,255,0.65); }
        `;
      case "amber":
        return `
          background: ${theme.colors.status.menunggu.bg};
          border-color: ${theme.colors.status.menunggu.border};
          .chip-num { color: ${theme.colors.status.menunggu.text}; }
          .chip-label { color: ${theme.colors.status.menunggu.text}; opacity: 0.75; }
        `;
      case "blue":
        return `
          background: ${theme.colors.status.proses.bg};
          border-color: ${theme.colors.status.proses.border};
          .chip-num { color: ${theme.colors.status.proses.text}; }
          .chip-label { color: ${theme.colors.status.proses.text}; opacity: 0.75; }
        `;
      case "green":
        return `
          background: ${theme.colors.status.selesai.bg};
          border-color: ${theme.colors.status.selesai.border};
          .chip-num { color: ${theme.colors.status.selesai.text}; }
          .chip-label { color: ${theme.colors.status.selesai.text}; opacity: 0.75; }
        `;
    }
  }}

  .chip-num {
    font-size: 22px;
    font-weight: 800;
    line-height: 1;
  }

  .chip-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

/* ---- Page Body ---- */
const PageBody = styled.div`
  flex: 1;
  padding: 24px 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* ---- Toast (Figma #523:2561 "Alerts & Toast") ---- */
const Toast = styled.div<{ $type?: "success" | "error" }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 18px;
  background: ${({ $type }) => ($type === "error" ? "#fef2f2" : "#f0fdf4")};
  border: 1px solid ${({ $type }) => ($type === "error" ? "#fecaca" : "#bbf7d0")};
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $type }) => ($type === "error" ? "#b91c1c" : "#166534")};

  button {
    font-size: 11px;
    font-weight: 700;
    color: inherit;
    background: transparent;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
  }
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

/* ---- Filter + Search Toolbar (Figma #523:641) ---- */
const ToolbarCard = styled.div`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: 12px;
  padding: 14px 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 320px;

  input {
    width: 100%;
    padding: 8px 14px 8px 36px;
    font-size: 13px;
    border: 1px solid ${theme.colors.borderInput};
    border-radius: ${theme.radii.pill};
    background: #f9fafb;
    color: ${theme.colors.textDark};
    outline: none;
    font-family: inherit;
    transition: border-color 0.18s ease;

    &:focus {
      border-color: ${theme.colors.cyanPrimary};
      background: #fff;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  .search-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const CategorySelect = styled.select`
  font-size: 12px;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: ${theme.radii.pill};
  border: 1px solid ${theme.colors.borderInput};
  background: #f9fafb;
  color: #374151;
  cursor: pointer;
  outline: none;
  font-family: inherit;
  transition: border-color 0.18s ease;

  &:focus {
    border-color: ${theme.colors.cyanPrimary};
  }
`;

const StatusPill = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: ${theme.radii.pill};
  font-size: 12px;
  font-weight: 700;
  border: 1.5px solid;
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: inherit;

  ${({ $active }) =>
    $active
      ? `
      background: ${theme.colors.navyDark};
      border-color: ${theme.colors.navyDark};
      color: #ffffff;
    `
      : `
      background: transparent;
      border-color: ${theme.colors.borderInput};
      color: #6b7280;
      &:hover {
        border-color: ${theme.colors.navyDark};
        color: ${theme.colors.navyDark};
      }
    `}
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

/* ---- Data Table Container (Figma #523:657) ---- */
const TableCard = styled.div`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const TableHeader = styled.div`
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

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmptyBox = styled.div`
  padding: 56px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  h3 {
    font-size: 15px;
    font-weight: 800;
    color: ${theme.colors.textDark};
  }

  p {
    font-size: 13px;
    color: ${theme.colors.textMuted};
    max-width: 380px;
  }
`;

const LoadingBox = styled.div`
  padding: 56px 24px;
  text-align: center;
  font-size: 13px;
  color: ${theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

/* ---- Search icon SVG ---- */
function SearchIcon() {
  return (
    <svg className="search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

/* ============================================================
   PAGE COMPONENT
   ============================================================ */
export default function AdminAspirasiPage() {
  const router = useRouter();
  const { isAuthenticated, role, isLoading: authLoading } = useAuth();

  const [reports, setReports] = useState<AspirasiReport[]>([]);
  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendLive, setIsBackendLive] = useState(false);

  const [activeStatus, setActiveReportForStatus] = useState<AspirasiReport | null>(null);
  const [activeFeedback, setActiveReportForFeedback] = useState<AspirasiReport | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: "success" | "error" } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kategoriFilter, setKategoriFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || role !== "admin")) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, role, router]);

  const loadData = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const kategoriRes = await kategoriApi.getAll().catch(() => []);
      setKategoris(kategoriRes);

      const aspirasiList = await aspirasiApi.getAll().catch((err: unknown) => {
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr.response?.status === 404) {
          setApiError(
            "Endpoint GET /api/aspirasi belum dibuat di routes/api.php backend Laravel (HTTP 404 Not Found)."
          );
        } else {
          setApiError("Gagal mengambil data aspirasi dari server Laravel.");
        }
        return [];
      });
      setReports(aspirasiList);
      setIsBackendLive(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && role === "admin") loadData();
  }, [isAuthenticated, role]);

  const filteredReports = useMemo(() => {
    let r = [...reports];
    if (statusFilter !== "all") {
      r = r.filter((x) => (x.status ?? x.aspirasi?.status) === statusFilter);
    }
    if (kategoriFilter !== "all") {
      r = r.filter((x) => {
        const catId = x.id_kategori ?? x.kategori_id ?? x.kategori?.id_kategori;
        return String(catId) === kategoriFilter;
      });
    }
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
      r = r.filter((x) => {
        const inp = x.input_aspirasi ?? x.inputAspirasi ?? {};
        const lok = (x.lokasi ?? inp.lokasi ?? "").toLowerCase();
        const ket = (x.ket ?? x.keterangan ?? inp.ket ?? inp.keterangan ?? "").toLowerCase();
        const nis = String(x.nis ?? inp.nis ?? "");
        const kls = (x.kelas ?? inp.siswa?.kelas ?? "").toLowerCase();
        return lok.includes(q) || ket.includes(q) || nis.includes(q) || kls.includes(q);
      });
    }
    return r;
  }, [reports, statusFilter, kategoriFilter, dateFrom, dateTo, searchQuery]);

  const hasActiveFilter =
    statusFilter !== "all" ||
    kategoriFilter !== "all" ||
    dateFrom !== "" ||
    dateTo !== "" ||
    searchQuery.trim() !== "";

  const resetAllFilters = () => {
    setStatusFilter("all");
    setKategoriFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
  };

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmStatus = async (id: number, status: StatusAspirasi) => {
    try {
      await aspirasiApi.updateStatus(id, status);
      showToast(`Status laporan #${id} berhasil diubah → "${status}"`);
      await loadData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || "Gagal mengubah status di server Laravel.";
      showToast(msg, "error");
    }
  };

  const handleConfirmFeedback = async (id: number, feedback: string, status?: StatusAspirasi) => {
    try {
      await aspirasiApi.sendFeedback(id, feedback, status);
      showToast(`Tanggapan untuk laporan #${id} berhasil dikirim.`);
      await loadData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || "Gagal mengirim tanggapan ke server Laravel.";
      showToast(msg, "error");
    }
  };

  const total = reports.length;
  const menunggu = reports.filter((r) => (r.status ?? r.aspirasi?.status) === "Menunggu").length;
  const proses = reports.filter((r) => (r.status ?? r.aspirasi?.status) === "Proses").length;
  const selesai = reports.filter((r) => (r.status ?? r.aspirasi?.status) === "Selesai").length;

  const statusTabs = [
    { key: "all", label: "Semua" },
    { key: "Menunggu", label: "Menunggu" },
    { key: "Proses", label: "Proses" },
    { key: "Selesai", label: "Selesai" },
  ] as const;

  return (
    <PageLayout>
      <AdminSidebar />

      <MainContent>
        {/* Top Banner */}
        <TopBanner>
          <BannerTitle>
            <h1>Daftar Aspirasi Masuk</h1>
            <LiveDot $live={isBackendLive}>
              {isBackendLive ? "Live" : "Demo"}
            </LiveDot>
          </BannerTitle>
          <BannerSub>
            Kelola pengaduan sarana, ubah status penanganan, dan berikan tanggapan resmi tim sarpras.
          </BannerSub>

          {/* Stat Chips */}
          <StatChips>
            <StatChip $color="navy">
              <div>
                <div className="chip-num">{total}</div>
                <div className="chip-label">Total</div>
              </div>
            </StatChip>
            <StatChip $color="amber">
              <div>
                <div className="chip-num">{menunggu}</div>
                <div className="chip-label">Menunggu</div>
              </div>
            </StatChip>
            <StatChip $color="blue">
              <div>
                <div className="chip-num">{proses}</div>
                <div className="chip-label">Proses</div>
              </div>
            </StatChip>
            <StatChip $color="green">
              <div>
                <div className="chip-num">{selesai}</div>
                <div className="chip-label">Selesai</div>
              </div>
            </StatChip>
          </StatChips>
        </TopBanner>

        <PageBody>
          {/* Toast */}
          {toastMessage && (
            <Toast $type={toastMessage.type}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {toastMessage.type === "error" ? <AlertTriangleIcon size={16} /> : <CheckCircleIcon size={16} />}
                {toastMessage.text}
              </span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                style={{ display: "flex", alignItems: "center", padding: "2px" }}
                title="Tutup"
              >
                <CloseIcon size={14} />
              </button>
            </Toast>
          )}

          {/* Notifikasi jika endpoint backend belum diimplementasikan */}
          {apiError && (
            <NoticeBox>
              <AlertTriangleIcon size={18} />
              <span>{apiError}</span>
            </NoticeBox>
          )}

          {/* Filter Toolbar */}
          <ToolbarCard>
            <SearchBox>
              <SearchIcon />
              <input
                type="text"
                placeholder="Cari NIS, lokasi, keterangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBox>

            <FilterGroup>
              {kategoris.length > 0 && (
                <CategorySelect
                  value={kategoriFilter}
                  onChange={(e) => setKategoriFilter(e.target.value)}
                >
                  <option value="all">Semua Kategori</option>
                  {kategoris.map((k: any, idx: number) => {
                    const catId = k.id_kategori ?? k.id ?? idx;
                    return (
                      <option key={catId} value={String(catId)}>
                        {k.ket_kategori}
                      </option>
                    );
                  })}
                </CategorySelect>
              )}

              {statusTabs.map((tab) => (
                <StatusPill
                  key={tab.key}
                  type="button"
                  $active={statusFilter === tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                >
                  {tab.label}
                </StatusPill>
              ))}

              {/* Filter Tanggal */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Tgl:</span>
                <DateInput
                  type="date"
                  aria-label="Dari tanggal"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  title="Dari tanggal"
                />
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>—</span>
                <DateInput
                  type="date"
                  aria-label="Sampai tanggal"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  title="Sampai tanggal"
                />
              </div>

              {/* Reset Filter Button */}
              {hasActiveFilter && (
                <ResetBtn type="button" onClick={resetAllFilters}>
                  <RotateCcwIcon size={12} />
                  Reset
                </ResetBtn>
              )}
            </FilterGroup>
          </ToolbarCard>

          {/* Data Table */}
          <TableCard>
            <TableHeader>
              <h2>
                {statusFilter === "all" ? "Semua Laporan" : `Laporan: ${statusFilter}`}
              </h2>
              <span>
                {filteredReports.length} dari {total} entri
              </span>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingBox>
                  <span>Memuat data laporan...</span>
                </LoadingBox>
              ) : filteredReports.length === 0 ? (
                <EmptyBox>
                  <h3>{total === 0 ? "Belum Ada Laporan Pengaduan" : "Tidak Ada Laporan Ditemukan"}</h3>
                  <p>
                    {total === 0
                      ? "Belum ada aspirasi atau keluhan sarana yang dikirimkan oleh siswa."
                      : "Sesuaikan kata kunci pencarian atau filter status untuk menemukan laporan yang cocok."}
                  </p>
                </EmptyBox>
              ) : (
                filteredReports.map((report: any, idx: number) => {
                  const repId = report.id_pelaporan ?? report.id_aspirasi ?? report.id ?? idx;
                  return (
                    <ReportCard
                      key={repId}
                      report={report}
                      isAdmin={true}
                      onUpdateStatus={(r) => setActiveReportForStatus(r)}
                      onGiveFeedback={(r) => setActiveReportForFeedback(r)}
                    />
                  );
                })
              )}
            </TableBody>
          </TableCard>
        </PageBody>
      </MainContent>

      {/* Modals */}
      <StatusChangeModal
        isOpen={!!activeStatus}
        onClose={() => setActiveReportForStatus(null)}
        report={activeStatus}
        onConfirm={handleConfirmStatus}
      />
      <FeedbackModal
        isOpen={!!activeFeedback}
        onClose={() => setActiveReportForFeedback(null)}
        report={activeFeedback}
        onConfirm={handleConfirmFeedback}
      />
    </PageLayout>
  );
}
