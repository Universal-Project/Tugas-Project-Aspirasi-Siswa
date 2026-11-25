"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { CheckCircleIcon, AlertTriangleIcon, CloseIcon, PlusIcon } from "@/components/ui/Icons";
import { kategoriApi } from "@/lib/api";

type Kategori = any;

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
  gap: 20px;
`;

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
  }
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid ${theme.colors.borderSoft};
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 14px;
    font-weight: 800;
    color: ${theme.colors.navyDark};
  }

  span {
    font-size: 12px;
    color: ${theme.colors.textMuted};
  }
`;

const CardBody = styled.div`
  padding: 20px;
`;

const FormRow = styled.form`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  min-width: 240px;
  padding: 9px 16px;
  font-size: 13px;
  border: 1.5px solid ${theme.colors.borderInput};
  border-radius: ${theme.radii.pill};
  background: #f9fafb;
  color: ${theme.colors.textDark};
  outline: none;
  font-family: inherit;
  transition: all 0.18s ease;

  &:focus {
    border-color: ${theme.colors.cyanPrimary};
    background: #fff;
    box-shadow: 0 0 0 2px rgba(0, 155, 232, 0.15);
  }
`;

const PrimaryBtn = styled.button`
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  background: linear-gradient(135deg, #32BCFB 0%, #009BE8 100%);
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;

  &:hover {
    filter: brightness(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    text-align: left;
    padding: 12px 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${theme.colors.textMuted};
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    padding: 14px 20px;
    border-bottom: 1px solid #f1f5f9;
    color: ${theme.colors.textDark};
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: #fafafa;
  }
`;

const ActionBtn = styled.button<{ $variant?: "edit" | "delete" | "cancel" }>`
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 700;
  border-radius: ${theme.radii.pill};
  border: 1px solid;
  cursor: pointer;
  transition: all 0.18s ease;
  margin-right: 6px;

  ${({ $variant }) => {
    switch ($variant) {
      case "delete":
        return `
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
          &:hover { background: #fee2e2; }
        `;
      case "edit":
        return `
          background: #e0f2fe;
          border-color: #bae6fd;
          color: #0284c7;
          &:hover { background: #bae6fd; }
        `;
      default:
        return `
          background: #f3f4f6;
          border-color: #e5e7eb;
          color: #4b5563;
          &:hover { background: #e5e7eb; }
        `;
    }
  }}
`;

const EmptyBox = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: ${theme.colors.textMuted};
  font-size: 13px;
`;

export default function AdminKategoriPage() {
  const router = useRouter();
  const { isAuthenticated, role, isLoading: authLoading } = useAuth();

  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newKategori, setNewKategori] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || role !== "admin")) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, role, router]);

  const loadData = async () => {
    setIsLoading(true);
    const data = await kategoriApi.getAll();
    setKategoris(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && role === "admin") loadData();
  }, [isAuthenticated, role]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newKategori.trim();
    if (trimmed.length < 3) {
      showToast("Kategori minimal 3 karakter.", "error");
      return;
    }
    if (trimmed.length > 55) {
      showToast("Kategori maksimal 55 karakter.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await kategoriApi.create(trimmed);
      setNewKategori("");
      showToast(`Kategori "${trimmed}" berhasil ditambahkan ke database!`);
      await loadData();
    } catch {
      showToast("Gagal menambahkan kategori. Periksa koneksi backend.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (item: Kategori) => {
    setEditingId(item.id);
    setEditingText(item.ket_kategori);
  };

  const handleSaveEdit = async (id: number) => {
    const trimmed = editingText.trim();
    if (trimmed.length < 3 || trimmed.length > 55) {
      showToast("Nama kategori harus antara 3 - 55 karakter.", "error");
      return;
    }

    try {
      await kategoriApi.update(id, trimmed);
      setEditingId(null);
      showToast("Kategori berhasil diperbarui.");
      await loadData();
    } catch {
      showToast("Gagal memperbarui kategori.", "error");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return;

    try {
      await kategoriApi.delete(id);
      showToast(`Kategori "${name}" berhasil dihapus.`);
      await loadData();
    } catch {
      showToast("Gagal menghapus kategori.", "error");
    }
  };

  return (
    <PageLayout>
      <AdminSidebar />

      <MainContent>
        <TopBanner>
          <BannerTag>Master Data Sarpras</BannerTag>
          <BannerTitle>Kelola Kategori Sarana &amp; Prasarana</BannerTitle>
          <BannerSub>
            Data kategori disinkronisasi langsung dengan endpoint API Laravel (<code>/api/kategori</code>) di MySQL.
          </BannerSub>
        </TopBanner>

        <PageBody>
          {toast && (
            <Toast $type={toast.type}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {toast.type === "error" ? <AlertTriangleIcon size={16} /> : <CheckCircleIcon size={16} />}
                {toast.msg}
              </span>
              <button
                type="button"
                onClick={() => setToast(null)}
                style={{ display: "flex", alignItems: "center", padding: "2px" }}
                title="Tutup"
              >
                <CloseIcon size={14} />
              </button>
            </Toast>
          )}

          {/* Form Tambah Kategori */}
          <Card>
            <CardHeader>
              <h2>Tambah Kategori Baru</h2>
              <span>Endpoint: POST /api/kategori</span>
            </CardHeader>
            <CardBody>
              <FormRow onSubmit={handleCreate}>
                <Input
                  type="text"
                  placeholder="Contoh: Laboratorium Komputer & RPL (3-55 karakter)"
                  value={newKategori}
                  onChange={(e) => setNewKategori(e.target.value)}
                  maxLength={55}
                  required
                />
                <PrimaryBtn
                  type="submit"
                  disabled={isSubmitting || !newKategori.trim()}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <PlusIcon size={14} />
                  {isSubmitting ? "Menyimpan..." : "Tambah Kategori"}
                </PrimaryBtn>
              </FormRow>
            </CardBody>
          </Card>

          {/* Daftar Kategori */}
          <Card>
            <CardHeader>
              <h2>Daftar Kategori Fasilitas</h2>
              <span>{kategoris.length} total kategori</span>
            </CardHeader>

            {isLoading ? (
              <EmptyBox>Memuat daftar kategori dari server Laravel...</EmptyBox>
            ) : kategoris.length === 0 ? (
              <EmptyBox>
                Belum ada kategori sarana di database MySQL. Silakan tambahkan kategori pertama menggunakan form di atas.
              </EmptyBox>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>ID</th>
                    <th>Nama Keterangan Kategori</th>
                    <th style={{ width: "160px", textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kategoris.map((item: any, idx: number) => {
                    const id = item.id_kategori ?? item.id ?? idx;
                    return (
                      <tr key={id}>
                        <td style={{ fontWeight: 700, color: theme.colors.navyDark }}>
                          #{id}
                        </td>
                        <td>
                          {editingId === id ? (
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <Input
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                maxLength={55}
                                style={{ padding: "5px 12px" }}
                              />
                              <ActionBtn
                                $variant="edit"
                                type="button"
                                onClick={() => handleSaveEdit(id)}
                              >
                                Simpan
                              </ActionBtn>
                              <ActionBtn
                                $variant="cancel"
                                type="button"
                                onClick={() => setEditingId(null)}
                              >
                                Batal
                              </ActionBtn>
                            </div>
                          ) : (
                            <strong>{item.ket_kategori}</strong>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {editingId !== id && (
                            <>
                              <ActionBtn
                                $variant="edit"
                                type="button"
                                onClick={() => handleStartEdit(item)}
                              >
                                Edit
                              </ActionBtn>
                              <ActionBtn
                                $variant="delete"
                                type="button"
                                onClick={() => handleDelete(id, item.ket_kategori)}
                              >
                                Hapus
                              </ActionBtn>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Card>
        </PageBody>
      </MainContent>
    </PageLayout>
  );
}
