<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AspirasiController;
use App\Http\Controllers\InputAspirasiController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\SiswaController;

// ================= LOGIN (publik) =================
Route::post('/login/admin', [AdminController::class, 'index']);
Route::post('/login/siswa', [SiswaController::class, 'index']);

// ================= KATEGORI =================
// Dibaca admin & siswa (siswa butuh buat pilih kategori saat melapor)
Route::middleware('auth:sanctum')->get('/kategori', [KategoriController::class, 'index']);

// ================= ADMIN =================
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/test', fn () => response()->json(['message' => 'Middleware Admin berhasil']));

    // Kelola kategori (index sudah di atas)
    Route::apiResource('kategori', KategoriController::class)->except(['index']);

    // List aspirasi keseluruhan + filter
    // ?tanggal=2026-11-24&bulan=11&tahun=2026&nis=123&id_kategori=1&status=Proses
    Route::get('aspirasi', [AspirasiController::class, 'index']);
    Route::get('aspirasi/{aspirasi}', [AspirasiController::class, 'show']);

    // Status penyelesaian & umpan balik
    Route::patch('aspirasi/{aspirasi}/status', [AspirasiController::class, 'updateStatus']);
    Route::patch('aspirasi/{aspirasi}/feedback', [AspirasiController::class, 'updateFeedback']);

    // Hapus (opsional)
    Route::delete('aspirasi/{aspirasi}', [AspirasiController::class, 'destroy']);
});

// ================= SISWA =================
Route::middleware(['auth:sanctum', 'siswa'])->prefix('siswa')->group(function () {
    Route::get('/test', fn () => response()->json(['message' => 'Middleware Siswa berhasil']));

    // Histori aspirasi milik sendiri (sekaligus status, feedback, progres)
    Route::get('aspirasi', [InputAspirasiController::class, 'index']);
    Route::post('aspirasi', [InputAspirasiController::class, 'store']);
    Route::get('aspirasi/{inputAspirasi}', [InputAspirasiController::class, 'show']);
    Route::put('aspirasi/{inputAspirasi}', [InputAspirasiController::class, 'update']);
    Route::delete('aspirasi/{inputAspirasi}', [InputAspirasiController::class, 'destroy']);
});