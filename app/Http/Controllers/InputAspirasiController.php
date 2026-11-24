<?php

namespace App\Http\Controllers;

use App\Models\Aspirasi;
use App\Models\InputAspirasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InputAspirasiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $data = InputAspirasi::with(['kategori', 'aspirasi'])
        ->where('nis', $request->user()->nis)
        ->latest()
        ->paginate(10);

    return response()->json([
        'success' => true,
        'message' => 'Daftar histori aspirasi',
        'data'    => $data,
    ]);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'id_kategori' => 'required|integer|exists:kategoris,id_kategori',
        'lokasi'      => 'required|string|max:50',
        'ket'         => 'required|string|max:50',
    ]);

    $input = DB::transaction(function () use ($validated, $request) {
        $input = InputAspirasi::create($validated + ['nis' => $request->user()->nis]);

        // id_aspirasi sengaja disamakan dengan id_pelaporan
        Aspirasi::forceCreate([
            'id_aspirasi' => $input->id_pelaporan,
            'id_kategori' => $validated['id_kategori'],
            'status'      => 'Menunggu',
        ]);

        return $input;
    });

    return response()->json([
        'success' => true,
        'message' => 'Aspirasi berhasil dikirim',
        'data'    => $input->load('aspirasi'),
    ], 201);
}
    public function show(InputAspirasi $inputAspirasi, Request $request): JsonResponse
    {
        abort_if($inputAspirasi->nis !== $request->user()->nis, 403, 'Bukan aspirasi kamu');

    return response()->json([
        'success' => true,
        'data'    => $inputAspirasi->load(['kategori', 'aspirasi']),
    ]);
    }

    public function update(Request $request, InputAspirasi $inputAspirasi): JsonResponse
{
    $this->authorizeSiswa($request, $inputAspirasi);

    $validated = $request->validate([
        'id_kategori' => 'sometimes|required|integer|exists:kategoris,id_kategori',
        'lokasi'      => 'sometimes|required|string|max:50',
        'ket'         => 'sometimes|required|string|max:50',
    ]);

    DB::transaction(function () use ($inputAspirasi, $validated) {
        $inputAspirasi->update($validated);

        // jaga supaya kategori di aspirasis tetap sinkron
        if (isset($validated['id_kategori'])) {
            $inputAspirasi->aspirasi()->update(['id_kategori' => $validated['id_kategori']]);
        }
    });

    return response()->json([
        'success' => true,
        'message' => 'Aspirasi berhasil diperbarui',
        'data'    => $inputAspirasi->fresh(['kategori', 'aspirasi']),
    ]);
}

public function destroy(Request $request, InputAspirasi $inputAspirasi): JsonResponse
{
    $this->authorizeSiswa($request, $inputAspirasi);

    DB::transaction(function () use ($inputAspirasi) {
        $inputAspirasi->aspirasi()->delete();   // hapus pasangan dulu
        $inputAspirasi->delete();
    });

    return response()->json([
        'success' => true,
        'message' => 'Aspirasi berhasil dihapus',
    ]);
}

// Cek pemilik + status masih Menunggu
private function authorizeSiswa(Request $request, InputAspirasi $inputAspirasi): void
{
    abort_if((int) $inputAspirasi->nis !== (int) $request->user()->nis, 403, 'Bukan aspirasi kamu');

    abort_if(
        optional($inputAspirasi->aspirasi)->status !== 'Menunggu',
        422,
        'Aspirasi sudah diproses, tidak bisa diubah atau dihapus'
    );
}
}