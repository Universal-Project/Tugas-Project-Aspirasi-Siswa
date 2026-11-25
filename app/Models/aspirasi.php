<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aspirasi extends Model
{
    protected $table = 'aspirasis';
    protected $primaryKey = 'id_aspirasi';

    protected $fillable = ['status', 'id_kategori', 'feedback'];

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'id_kategori', 'id_kategori');
    }

    public function inputAspirasi()
    {
        return $this->belongsTo(InputAspirasi::class, 'id_aspirasi', 'id_pelaporan');
    }
}