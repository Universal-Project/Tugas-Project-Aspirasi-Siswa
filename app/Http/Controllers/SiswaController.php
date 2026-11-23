<?php

namespace App\Http\Controllers;

use App\Models\siswa;
use Illuminate\Http\Request;


class SiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
          
        $request->validate([
            'nis' => 'required',
            'kelas' => 'required'
        ]);

        $siswa = Siswa::where('nis', $request->nis)->first();

        if (!$siswa || $siswa->kelas != $request->kelas) {
            return response()->json([
                'message' => 'NIS atau Kelas salah'
            ], 401);
        }

        $token = $siswa->createToken('siswa-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'siswa' => [
                'nis' => $siswa->nis,
                'kelas' => $siswa->kelas
            ],
            'token' => $token
        ], 200);
    
    
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(siswa $siswa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(siswa $siswa)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, siswa $siswa)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(siswa $siswa)
    {
        //
    }
}
