<?php

namespace App\Http\Controllers;

use App\Models\kategori;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return kategori::get();
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
        $request->validate([
            'ket_kategori' => 'required|string|min:3|max:55'
        ]);

        $data = kategori::create($request->all());

        return response()->json(['Data' => $data, 'Message' => 'Kategotri Added'],201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $kategori = kategori::find($id);
          if (!$kategori) {
        return response()->json([
            'message' => 'Kategori tidak ditemukan'
        ], 404);
    }

    return response()->json([
        'data' => $kategori
    ], 200);
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(kategori $kategori)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {   
        $data = kategori::find($id);
        $request->validate([
            'ket_kategori' => 'required|string|min:3|max:55'
        ]);

        if (!$data) {
        return response()->json([
            'message' => 'Kategori tidak ditemukan'
        ], 404);}

        $data->update($request->all());
        return response()->json(['Data' => $data, 'Message' => 'Data Updated'],200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $data = kategori::find($id);

        if (!$data) {
        return response()->json([
            'message' => 'Kategori tidak ditemukan'
        ], 404);}

        $data->delete($id);
        return response()->json(['Data' => $data, 'Message' => 'Data Deleted'],200);
    }
}
