"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { Button, Textarea, Select } from "../ui/StyledComponents";
import { CloseIcon } from "../ui/Icons";

export type StatusAspirasi = "Menunggu" | "Proses" | "Selesai" | string;
export type AspirasiReport = any;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 16, 53, 0.6);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: ${theme.shadows.modal};
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  border: 1px solid ${theme.colors.borderSoft};
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .modal-title {
    font-size: 15px;
    font-weight: 800;
    color: ${theme.colors.navyDark};
  }

  .modal-subtitle {
    font-size: 11px;
    color: ${theme.colors.textMuted};
    margin-top: 2px;
  }

  .btn-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: #737373;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #171717;
    }
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .report-quote {
    background: #f8fafc;
    border: 1px solid ${theme.colors.borderSoft};
    border-radius: 12px;
    padding: 12px;
    font-size: 12px;
    color: #525252;
    font-style: italic;
  }

  .footer-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid ${theme.colors.borderSoft};
  }
`;

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AspirasiReport | null;
  onConfirm: (id: number, feedback: string, status?: StatusAspirasi) => Promise<void>;
}

export function FeedbackModal({
  isOpen,
  onClose,
  report,
  onConfirm,
}: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");
  const [targetStatus, setTargetStatus] = useState<StatusAspirasi>("Proses");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (report) {
      setFeedback(report.feedback !== null && report.feedback !== undefined ? String(report.feedback) : "");
      setTargetStatus(report.status === "Menunggu" ? "Proses" : report.status);
    }
  }, [report]);

  if (!isOpen || !report) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const str = String(feedback ?? "").trim();
    if (!str) return;
    setIsLoading(true);
    const repId = report.id_pelaporan ?? report.id_aspirasi ?? report.id;
    await onConfirm(repId, str, targetStatus);
    setIsLoading(false);
    onClose();
  };

  const input = report.input_aspirasi ?? report.inputAspirasi ?? {};
  const repId = report.id_pelaporan ?? report.id_aspirasi ?? report.id;
  const repKet = report.ket ?? report.keterangan ?? input.ket ?? input.keterangan ?? "-";
  const repLokasi = report.lokasi ?? input.lokasi ?? "-";

  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <div className="modal-title">Beri Tanggapan Resmi</div>
            <div className="modal-subtitle">
              Laporan #{repId} • {repLokasi}
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-close">
            <CloseIcon className="w-5 h-5" />
          </button>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="report-quote">&ldquo;{repKet}&rdquo;</div>

            <div>
              <span style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>
                Respon / Tindak Lanjut Tim Sarpras:
              </span>
              <Textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tuliskan keterangan perbaikan, jadwal penanganan teknisi, atau konfirmasi penyelesaian sarana..."
                required
              />
            </div>

            <div>
              <span style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>
                Perbarui Status:
              </span>
              <Select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as StatusAspirasi)}
              >
                <option value="Menunggu">Menunggu</option>
                <option value="Proses">Proses (Sedang Dikerjakan)</option>
                <option value="Selesai">Selesai (Sudah Tuntas)</option>
              </Select>
            </div>

            <div className="footer-actions">
              <Button type="button" $variant="outline" $size="sm" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" $variant="primary" $size="sm" disabled={isLoading}>
                {isLoading ? "Mengirim..." : "Kirim Tanggapan"}
              </Button>
            </div>
          </ModalBody>
        </form>
      </ModalCard>
    </Backdrop>
  );
}
