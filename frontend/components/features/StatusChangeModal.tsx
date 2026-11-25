"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { Button, StatusBadge } from "../ui/StyledComponents";
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
  max-width: 480px;
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

  .preview-box {
    background: #f8fafc;
    border: 1px solid ${theme.colors.borderSoft};
    border-radius: 12px;
    padding: 12px;
    font-size: 12px;
  }

  .status-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid ${theme.colors.borderSoft};
    cursor: pointer;
    transition: all 0.2s ease;

    &.selected {
      border-color: ${theme.colors.cyanPrimary};
      background: rgba(0, 155, 232, 0.06);
    }
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

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AspirasiReport | null;
  onConfirm: (id: number, status: StatusAspirasi) => Promise<void>;
}

export function StatusChangeModal({
  isOpen,
  onClose,
  report,
  onConfirm,
}: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatusAspirasi>("Menunggu");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (report) setSelectedStatus(report.status);
  }, [report]);

  if (!isOpen || !report) return null;

  const repId = report.id_pelaporan ?? report.id_aspirasi ?? report.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onConfirm(repId, selectedStatus);
    setIsLoading(false);
    onClose();
  };

  const statusOptions: StatusAspirasi[] = ["Menunggu", "Proses", "Selesai"];

  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <div className="modal-title">Ubah Status Aspirasi</div>
            <div className="modal-subtitle">
              Laporan #{repId} • {report.lokasi}
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-close">
            <CloseIcon className="w-5 h-5" />
          </button>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="preview-box">
              <strong style={{ display: "block", marginBottom: "4px" }}>Pengaduan:</strong>
              <p style={{ color: "#525252" }}>{report.keterangan}</p>
            </div>

            <div>
              <span style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>
                Pilih Status Penyelesaian:
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {statusOptions.map((st) => (
                  <label
                    key={st}
                    className={`status-option ${selectedStatus === st ? "selected" : ""}`}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="radio"
                        name="status"
                        checked={selectedStatus === st}
                        onChange={() => setSelectedStatus(st)}
                      />
                      <StatusBadge $status={st}>{st}</StatusBadge>
                    </div>
                    <span style={{ fontSize: "11px", color: "#737373" }}>
                      {st === "Menunggu"
                        ? "Dalam antrean"
                        : st === "Proses"
                        ? "Sedang ditangani"
                        : "Perbaikan tuntas"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="footer-actions">
              <Button type="button" $variant="outline" $size="sm" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" $variant="primary" $size="sm" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </ModalBody>
        </form>
      </ModalCard>
    </Backdrop>
  );
}
