<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class siswa extends Model
{   use HasApiTokens;

    protected $table = 'siswas';
    protected $primaryKey = 'nis';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'nis','kelas'
    ];
    
    public function inputAspirasi()
    {
        return $this->hasMany(InputAspirasi::class, 'nis', 'nis');
    }
}
