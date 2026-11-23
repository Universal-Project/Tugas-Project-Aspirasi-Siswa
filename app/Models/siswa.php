<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class siswa extends Model
{   use HasApiTokens;

    protected $primaryKey = 'nis';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'nis','kelas'
    ];
    
    public function inputAspirasi()
    {
        return $this->hasMany(input_aspirasi::class, 'nis', 'nis');
    }
}
