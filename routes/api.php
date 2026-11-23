<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\SiswaController;

// Login
Route::post('/login/admin', [AdminController::class, 'index']);
Route::post('/login/siswa', [SiswaController::class, 'index']);
Route::apiResource('/kategori', KategoriController::class);

// Test route Admin
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/test', function () {
        return response()->json([
            'message' => 'Middleware Admin berhasil'
        ]);
    });
});

// Test route Siswa
Route::middleware(['auth:sanctum', 'siswa'])->group(function () {
    Route::get('/siswa/test', function () {
        return response()->json([
            'message' => 'Middleware Siswa berhasil'
        ]);
    });
});