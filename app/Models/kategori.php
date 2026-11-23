<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class kategori extends Model
{
    protected $fillable = ['ket_kategori'];

    public function inputAspirasi(){
        return $this->hasMany(input_aspirasi::class, 'kategori_id');
    }
    public function aspirasi(){
        return $this->hasMany(aspirasi::class, 'kategori_id');
    }
}
