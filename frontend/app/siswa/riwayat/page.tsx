"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { StudentNavbar } from "@/components/layout/StudentNavbar";
import { Footer } from "@/components/layout/Footer";
import { ReportCard } from "@/components/features/ReportCard";
import { RotateCcwIcon, AlertTriangleIcon } from "@/components/ui/Icons";
import { aspirasiApi } from "@/lib/api";

type AspirasiReport = any;

/* ============================================================
   Figma Reference: Frame #523:1158 "Portal Siswa - Status Laporan Saya"
   - Sticky navbar, main content, sticky footer
   - Sub-Header bar: white bg, border, student info + stat chips
   - Section #523:1199 "Metric Badges": row of 4 chips (overlap pattern)
   - Filter + Ticket List: white card toolbar + card list
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
  padding: 28px 24px 48px;
`;

/* Sub-header bar matching Figma #523:1161 */
const SubHeader = styled.div`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: 14px;
  padding: 20px 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const NoticeBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #b91c1c;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SubHeaderTitle = styled.div`
  h1 {
    font-size: 20px;
    font-weight: 800;
    color: ${theme.colors.navyDark};
    letter-spacing: -0.4px;
  }

  p {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
  }
`;

const NewReportBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  background: linear-gradient(135deg, #32BCFB 0%, #009BE8 100%);
  color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 155, 232, 0.3);
  transition: all 0.18s ease;
  white-space: nowrap;

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
`;

/* Metric chips row (Figma #523:1199 "Bento style metrics") */
const MetricRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MetricCard = styled.div<{ $color: "navy" | "amber" | "blue" | "green" }>`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  .metric-left {
    display: flex;
    flex-direction: column;
  }

  .metric-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${theme.colors.textMuted};
    margin-bottom: 4px;
  }

  .metric-value {
    font-size: 26px;
    font-weight: 800;
    color: ${theme.colors.navyDark};
    line-height: 1;
  }

  .metric-badge {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 800;
    flex-shrink: 0;

    ${({ $color }) => {
      switch ($color) {
        case "navy":
          return `background: ${theme.colors.navyDark}; color: #ffffff;`;
        case "amber":
          return `background: ${theme.colors.status.menunggu.bg}; color: ${theme.colors.status.menunggu.text};`;
        case "blue":
          return `background: ${theme.colors.status.proses.bg}; color: ${theme.colors.status.proses.text};`;
        case "green":
          return `background: ${theme.colors.status.selesai.bg}; color: ${theme.colors.status.selesai.text};`;
      }
    }}
  }
`;

/* Filter toolbar */
const ToolbarCard = styled.div`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
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

const FilterTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const DateFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  .date-label {
    font-size: 11px;
    font-weight: 700;
    color: ${theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const DateInput = styled.input`
  padding: 6px 12px;
  font-size: 12px;
  border: 1.5px solid ${theme.colors.borderInput};
  border-radius: ${theme.radii.pill};
  background: #f9fafb;
  outline: none;
  font-family: inherit;
  color: ${theme.colors.textDark};
  transition: all 0.18s ease;

  &:focus {
    border-color: ${theme.colors.cyanPrimary};
    background: #fff;
    box-shadow: 0 0 0 2px rgba(0, 155, 232, 0.15);
  }
`;

const ResetFilterBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
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
    border-color: #dc2626;
  }
`;

const FilterTab = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  border: 1.5px solid;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;
  white-space: nowrap;

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

const EmptyState = styled.div`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: 12px;
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
  background: #ffffff;
  border-radius: 12px;
  font-size: 13px;
  color: ${theme.colors.textMuted};
`;

const ReportList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

function SearchIcon() {
  return (
    <svg className="icon" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export default function StudentRiwayatPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [reports, setReports] = useState<AspirasiReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    async function load() {
      if (!user || !("nis" in user)) return;
      setIsLoading(true);
      setApiError(null);
      try {
        const data = await aspirasiApi.getByNis(user.nis);
        setReports(data);
      } catch (err: unknown) {
        const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
        if (axiosErr.response?.status === 404) {
          setApiError(
            "Endpoint GET /api/siswa/aspirasi belum dibuat di routes/api.php backend Laravel (HTTP 404 Not Found)."
          );
        } else {
          setApiError("Gagal mengambil data pengaduan dari server Laravel.");
        }
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    }
    if (isAuthenticated) load();
  }, [isAuthenticated, user]);

  const filteredReports = useMemo(() => {
    let r = [...reports];
    // Status filter
    if (statusFilter !== "all") {
      r = r.filter((x) => (x.status || x.aspirasi?.status) === statusFilter);
    }
    // Date range filter — pure JS, zero extra API call
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      r = r.filter((x) => new Date(x.created_at).getTime() >= from);
    }
    if (dateTo) {
      // include the full "dateTo" day by going to 23:59:59
      const to = new Date(dateTo).getTime() + 86399999;
      r = r.filter((x) => new Date(x.created_at).getTime() <= to);
    }
    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter((x) => {
        const lok = (x.lokasi || "").toLowerCase();
        const ket = (x.ket || x.keterangan || "").toLowerCase();
        const kat = (x.kategori?.ket_kategori || "").toLowerCase();
        return lok.includes(q) || ket.includes(q) || kat.includes(q);
      });
    }
    return r;
  }, [reports, statusFilter, dateFrom, dateTo, searchQuery]);

  const hasActiveFilter =
    statusFilter !== "all" || dateFrom !== "" || dateTo !== "" || searchQuery.trim() !== "";

  function resetAllFilters() {
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
  }

  const total = reports.length;
  const menunggu = reports.filter((r) => (r.status || r.aspirasi?.status) === "Menunggu").length;
  const proses = reports.filter((r) => (r.status || r.aspirasi?.status) === "Proses").length;
  const selesai = reports.filter((r) => (r.status || r.aspirasi?.status) === "Selesai").length;

  const statusTabs = [
    { key: "all", label: "Semua" },
    { key: "Menunggu", label: "Menunggu" },
    { key: "Proses", label: "Proses" },
    { key: "Selesai", label: "Selesai" },
  ] as const;

  return (
    <PageWrapper>
      <StudentNavbar />

      <MainContent>
        {/* Sub-header */}
        <SubHeader>
          <SubHeaderTitle>
            <h1>Status Laporan Saya</h1>
            <p>Pantau progres tindak lanjut pengaduan fasilitas yang Anda laporkan.</p>
          </SubHeaderTitle>
          <NewReportBtn href="/siswa/aspirasi/create">
            + Buat Pengaduan Baru
          </NewReportBtn>
        </SubHeader>

        {/* Notifikasi Error jika Endpoint Backend Belum Siap */}
        {apiError && (
          <NoticeBox>
            <AlertTriangleIcon size={18} />
            <span>{apiError}</span>
          </NoticeBox>
        )}

        {/* Metric cards */}
        <MetricRow>
          <MetricCard $color="navy">
            <div className="metric-left">
              <div className="metric-label">Total</div>
              <div className="metric-value">{total}</div>
            </div>
            <div className="metric-badge">{total}</div>
          </MetricCard>
          <MetricCard $color="amber">
            <div className="metric-left">
              <div className="metric-label">Menunggu</div>
              <div className="metric-value">{menunggu}</div>
            </div>
            <div className="metric-badge">{menunggu}</div>
          </MetricCard>
          <MetricCard $color="blue">
            <div className="metric-left">
              <div className="metric-label">Diproses</div>
              <div className="metric-value">{proses}</div>
            </div>
            <div className="metric-badge">{proses}</div>
          </MetricCard>
          <MetricCard $color="green">
            <div className="metric-left">
              <div className="metric-label">Selesai</div>
              <div className="metric-value">{selesai}</div>
            </div>
            <div className="metric-badge">{selesai}</div>
          </MetricCard>
        </MetricRow>

        {/* Filter toolbar */}
        <ToolbarCard>
          <SearchBox>
            <SearchIcon />
            <input
              type="text"
              placeholder="Cari lokasi atau keterangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>

          <FilterTabs>
            {statusTabs.map((tab) => (
              <FilterTab
                key={tab.key}
                type="button"
                $active={statusFilter === tab.key}
                onClick={() => setStatusFilter(tab.key)}
              >
                {tab.label}
              </FilterTab>
            ))}
          </FilterTabs>

          {/* Filter Tanggal */}
          <DateFilterGroup>
            <span className="date-label">Tanggal:</span>
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
          </DateFilterGroup>

          {/* Reset filter jika ada yang aktif */}
          {hasActiveFilter && (
            <ResetFilterBtn type="button" onClick={resetAllFilters}>
              <RotateCcwIcon size={12} />
              Reset Filter
            </ResetFilterBtn>
          )}
        </ToolbarCard>

        {/* Report list */}
        {isLoading ? (
          <LoadingBox>Memuat daftar pengaduan...</LoadingBox>
        ) : filteredReports.length === 0 ? (
          <EmptyState>
            <h3>Belum Ada Laporan Pengaduan</h3>
            <p>
              {hasActiveFilter
                ? "Tidak ada pengaduan yang cocok dengan filter pencarian atau rentang tanggal."
                : 'Anda belum mengirimkan laporan. Klik "Buat Pengaduan Baru" untuk mengajukan aspirasi.'}
            </p>
          </EmptyState>
        ) : (
          <ReportList>
            {filteredReports.map((report: any, idx: number) => (
              <ReportCard key={report.id_pelaporan ?? report.id_aspirasi ?? report.id ?? idx} report={report} />
            ))}
          </ReportList>
        )}
      </MainContent>

      <Footer />
    </PageWrapper>
  );
}
