<?php

namespace App\Http\Controllers;

use App\Models\Aspirasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AspirasiController extends Controller
{
    // filter: ?tanggal=2026-11-24&bulan=11&tahun=2026&nis=123&id_kategori=1&status=Proses
    public function index(Request $request): JsonResponse
    {
        $query = Aspirasi::with(['kategori', 'inputAspirasi.siswa']);

        $query->when($request->tanggal, fn ($q, $v) => $q->whereDate('created_at', $v));
        $query->when($request->bulan, fn ($q, $v) => $q->whereMonth('created_at', $v));
        $query->when($request->tahun, fn ($q, $v) => $q->whereYear('created_at', $v));
        $query->when($request->id_kategori, fn ($q, $v) => $q->where('id_kategori', $v));
        $query->when($request->status, fn ($q, $v) => $q->where('status', $v));
        $query->when($request->nis, fn ($q, $v) =>
            $q->whereHas('inputAspirasi', fn ($i) => $i->where('nis', $v))
        );

        return response()->json([
            'success' => true,
            'message' => 'Daftar aspirasi',
            'data'    => $query->latest()->paginate(10),
        ]);
    }

    public function show(Aspirasi $aspirasi): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $aspirasi->load(['kategori', 'inputAspirasi.siswa']),
        ]);
    }

    public function updateStatus(Request $request, Aspirasi $aspirasi): JsonResponse
    {
        $data = $request->validate([
            'status' => 'required|in:Menunggu,Proses,Selesai',
        ]);

        $aspirasi->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Status berhasil diperbarui',
            'data'    => $aspirasi->load('kategori'),
        ]);
    }

    public function updateFeedback(Request $request, Aspirasi $aspirasi): JsonResponse
    {
        $data = $request->validate([
            'feedback' => 'required|integer',
        ]);

        $aspirasi->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Feedback berhasil disimpan',
            'data'    => $aspirasi->load('kategori'),
        ]);
    }

    // Hapus pasangan di kedua tabel (opsional, misalnya untuk spam)
    public function destroy(Aspirasi $aspirasi): JsonResponse
    {
        DB::transaction(function () use ($aspirasi) {
            $aspirasi->inputAspirasi()->delete();
            $aspirasi->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Aspirasi berhasil dihapus',
        ]);
    }
}