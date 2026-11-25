import axios from "axios";

/**
 * Konfigurasi Axios Client terpusat ke Laravel REST API
 * Mengacu pada struktur sederhana: baseURL + Bearer token interceptor + 401 redirect
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
  },
});

// Request Interceptor: Pasang Bearer token dari localStorage jika ada
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response Interceptor: Tangani 401 Unauthorized secara otomatis
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// 1. ROUTE LOGIN (Publik) — routes/api.php
// ============================================================================
// POST /api/login/admin
export const loginAdmin = async (data: { username: string; password: string }) => {
  const res = await api.post("/login/admin", data);
  return res.data;
};

// POST /api/login/siswa
export const loginSiswa = async (data: { nis: string; kelas: string }) => {
  const res = await api.post("/login/siswa", data);
  return res.data;
};

// ============================================================================
// 2. ROUTE KATEGORI — routes/api.php
// ============================================================================
// GET /api/kategori (dibaca admin & siswa untuk formulir aspirasi)
export const getKategori = async () => {
  const res = await api.get("/kategori");
  return Array.isArray(res.data) ? res.data : (res.data?.data || []);
};

// POST /api/admin/kategori
export const createKategori = async (ket_kategori: string) => {
  const res = await api.post("/admin/kategori", { ket_kategori });
  return res.data?.Data || res.data;
};

// PUT /api/admin/kategori/{id}
export const updateKategori = async (id: number, ket_kategori: string) => {
  const res = await api.put(`/admin/kategori/${id}`, { ket_kategori });
  return res.data?.Data || res.data;
};

// DELETE /api/admin/kategori/{id}
export const deleteKategori = async (id: number) => {
  const res = await api.delete(`/admin/kategori/${id}`);
  return res.data;
};

// ============================================================================
// 3. ROUTE ADMIN — prefix('admin') di routes/api.php
// ============================================================================
// GET /api/admin/test
export const checkAdminMiddleware = async () => {
  const res = await api.get("/admin/test");
  return res.data;
};

// GET /api/admin/aspirasi (?tanggal=&bulan=&tahun=&nis=&id_kategori=&status=)
export const getAdminAspirasi = async (params?: any) => {
  const res = await api.get("/admin/aspirasi", { params });
  const d = res.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data?.data)) return d.data.data;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

// GET /api/admin/aspirasi/{aspirasi}
export const getAdminAspirasiDetail = async (id: number) => {
  const res = await api.get(`/admin/aspirasi/${id}`);
  return res.data;
};

// PATCH /api/admin/aspirasi/{aspirasi}/status
export const updateAspirasiStatus = async (id: number, status: string) => {
  const res = await api.patch(`/admin/aspirasi/${id}/status`, { status });
  return res.data;
};

// PATCH /api/admin/aspirasi/{aspirasi}/feedback
export const updateAspirasiFeedback = async (id: number, feedback: number | string, status?: string) => {
  const payload: Record<string, any> = { feedback };
  if (status) {
    payload.status = status;
  }
  const res = await api.patch(`/admin/aspirasi/${id}/feedback`, payload);
  return res.data;
};

// DELETE /api/admin/aspirasi/{aspirasi}
export const deleteAdminAspirasi = async (id: number) => {
  const res = await api.delete(`/admin/aspirasi/${id}`);
  return res.data;
};

// ============================================================================
// 4. ROUTE SISWA — prefix('siswa') di routes/api.php
// ============================================================================
// GET /api/siswa/test
export const checkSiswaMiddleware = async () => {
  const res = await api.get("/siswa/test");
  return res.data;
};

// GET /api/siswa/aspirasi (histori aspirasi milik siswa yang login)
export const getSiswaAspirasi = async () => {
  const res = await api.get("/siswa/aspirasi");
  const d = res.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data?.data)) return d.data.data;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

// POST /api/siswa/aspirasi (kirim aspirasi baru)
export const postSiswaAspirasi = async (payload: {
  id_kategori?: number;
  kategori_id?: number;
  lokasi: string;
  ket?: string;
  keterangan?: string;
  nis?: string | number;
  kelas?: string;
}) => {
  const body = {
    id_kategori: Number(payload.id_kategori ?? payload.kategori_id),
    lokasi: payload.lokasi,
    ket: payload.ket ?? payload.keterangan,
  };
  const res = await api.post("/siswa/aspirasi", body);
  return res.data;
};

// GET /api/siswa/aspirasi/{inputAspirasi}
export const getSiswaAspirasiDetail = async (id: number) => {
  const res = await api.get(`/siswa/aspirasi/${id}`);
  return res.data;
};

// PUT /api/siswa/aspirasi/{inputAspirasi}
export const updateSiswaAspirasi = async (id: number, data: any) => {
  const res = await api.put(`/siswa/aspirasi/${id}`, data);
  return res.data;
};

// DELETE /api/siswa/aspirasi/{inputAspirasi}
export const deleteSiswaAspirasi = async (id: number) => {
  const res = await api.delete(`/siswa/aspirasi/${id}`);
  return res.data;
};

// ============================================================================
// Alias Object (Memudahkan pemanggilan di komponen)
// ============================================================================
export const authApi = {
  loginAdmin: (username: string, password: string) => loginAdmin({ username, password }),
  loginSiswa: (nis: string, kelas: string) => loginSiswa({ nis, kelas }),
  checkAdminMiddleware,
  checkSiswaMiddleware,
};

export const kategoriApi = {
  getAll: getKategori,
  create: createKategori,
  update: updateKategori,
  delete: deleteKategori,
};

export const aspirasiApi = {
  getAll: getAdminAspirasi,
  getBySiswa: getSiswaAspirasi,
  getByNis: (nis?: string | number) => getSiswaAspirasi(),
  create: postSiswaAspirasi,
  updateStatus: updateAspirasiStatus,
  updateFeedback: (id: number, feedback: number | string) => updateAspirasiFeedback(id, feedback),
  sendFeedback: updateAspirasiFeedback,
  delete: deleteAdminAspirasi,
};

export default api;
