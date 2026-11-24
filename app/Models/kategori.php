<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class kategori extends Model
{
    protected $table = 'kategoris';
    protected $primaryKey = 'id_kategori';
    protected $fillable = ['ket_kategori'];

    public function inputAspirasi(){
        return $this->hasMany(InputAspirasi::class, 'kategori_id');
    }
    public function aspirasi(){
        return $this->hasMany(Aspirasi::class, 'kategori_id');
    }
}
