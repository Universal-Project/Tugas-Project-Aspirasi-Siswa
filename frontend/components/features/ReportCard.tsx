"use client";

import React from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { CheckCircleIcon } from "@/components/ui/Icons";

export type AspirasiReport = any;

/* ============================================================
   Figma Reference: Section-02 "REPORT CARD PATTERNS" #523:2145
   - White card, border-radius 12px, 1px border, card shadow
   - CategoryTag: pill, navy bg (dark)
   - Status badge: color-coded pill
   - Meta row: location (cyan), date (muted), nis pill (navy bg)
   - Feedback box: green tint bg
   - Footer buttons: Outline + Primary (admin only)
   ============================================================ */

const Card = styled.div`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.07);
  }
`;

const CardBody = styled.div`
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;

const CategoryPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: ${theme.radii.pill};
  font-size: 11px;
  font-weight: 800;
  background: #f1f5f9;
  color: ${theme.colors.navyDark};
  border: 1px solid rgba(203, 213, 225, 0.6);
`;

const ReportId = styled.span`
  font-size: 11px;
  color: ${theme.colors.textMuted};
  font-weight: 600;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
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

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
`;

const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;

  svg {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }
`;

const NisTag = styled.span`
  background: #f1f5f9;
  border: 1px solid ${theme.colors.borderSoft};
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: ${theme.colors.navyDark};
`;

const Description = styled.p`
  font-size: 13.5px;
  color: #374151;
  line-height: 1.65;
`;

const FeedbackBox = styled.div`
  padding: 12px 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  font-size: 12px;
  color: #166534;
  line-height: 1.5;

  .fb-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 800;
    margin-bottom: 4px;
    color: #15803d;
  }

  .fb-text {
    color: #166534;
  }
`;

const CardFooter = styled.div`
  padding: 12px 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const BtnOutline = styled.button`
  padding: 7px 16px;
  font-size: 12px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  border: 1.5px solid ${theme.colors.borderInput};
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;

  &:hover {
    border-color: ${theme.colors.navyDark};
    color: ${theme.colors.navyDark};
  }
`;

const BtnPrimary = styled.button`
  padding: 7px 16px;
  font-size: 12px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  border: none;
  background: linear-gradient(135deg, #32BCFB 0%, #009BE8 100%);
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 1px 3px rgba(0, 155, 232, 0.25);
  transition: all 0.18s ease;

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
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

interface ReportCardProps {
  report: AspirasiReport;
  isAdmin?: boolean;
  onUpdateStatus?: (report: AspirasiReport) => void;
  onGiveFeedback?: (report: AspirasiReport) => void;
}

export function ReportCard({
  report,
  isAdmin = false,
  onUpdateStatus,
  onGiveFeedback,
}: ReportCardProps) {
  const input = report.input_aspirasi ?? report.inputAspirasi ?? {};
  const repId = report.id_pelaporan ?? report.id_aspirasi ?? report.id ?? "-";
  const currentStatus = report.status ?? report.aspirasi?.status ?? "Menunggu";
  const currentFeedback = report.feedback ?? report.aspirasi?.feedback;
  const currentKet = report.ket ?? report.keterangan ?? input.ket ?? input.keterangan ?? "-";
  const currentLokasi = report.lokasi ?? input.lokasi ?? "-";
  const currentNis = report.nis ?? input.nis ?? "-";
  const currentKelas = report.kelas ?? input.siswa?.kelas ?? "";
  const currentKategori = report.kategori?.ket_kategori ?? input.kategori?.ket_kategori ?? (report.id_kategori ? `Kategori #${report.id_kategori}` : "Fasilitas Sarpras");

  const formattedDate = report.created_at
    ? new Date(report.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <Card>
      <CardBody>
        {/* Header row */}
        <CardTop>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CategoryPill>{currentKategori}</CategoryPill>
            <ReportId>#{repId}</ReportId>
          </div>
          <StatusBadge $status={currentStatus}>{currentStatus}</StatusBadge>
        </CardTop>

        {/* Meta */}
        <MetaRow>
          <MetaItem style={{ color: theme.colors.cyanPrimary }}>
            <IconLocation />
            <span>{currentLokasi}</span>
          </MetaItem>
          <MetaItem style={{ color: theme.colors.textMuted }}>
            <IconClock />
            <span>{formattedDate}</span>
          </MetaItem>
          {isAdmin && (
            <NisTag>
              NIS {currentNis} {currentKelas ? `· ${currentKelas}` : ""}
            </NisTag>
          )}
        </MetaRow>

        {/* Description */}
        <Description>{currentKet}</Description>

        {/* Feedback */}
        {currentFeedback && (
          <FeedbackBox>
            <div className="fb-label" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <CheckCircleIcon size={14} />
              Tanggapan Resmi Tim Sarpras
            </div>
            <p className="fb-text">{currentFeedback}</p>
          </FeedbackBox>
        )}
      </CardBody>

      {/* Admin Actions */}
      {isAdmin && (
        <CardFooter>
          <BtnOutline
            type="button"
            onClick={() => onUpdateStatus?.(report)}
          >
            Ubah Status
          </BtnOutline>
          <BtnPrimary
            type="button"
            onClick={() => onGiveFeedback?.(report)}
          >
            {report.feedback ? "Edit Tanggapan" : "Beri Tanggapan"}
          </BtnPrimary>
        </CardFooter>
      )}
    </Card>
  );
}
