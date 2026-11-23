<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\admin;
use App\Models\siswa;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Data Admin
        admin::updateOrCreate(
            ['username' => 'admin'],
            [
                'password' => Hash::make('admin123')
            ]
        );

        // Data Siswa
        siswa::updateOrCreate(
            ['nis' => '123456'],
            [
                'kelas' => 'XI PPLG 1'
            ]
        );
    }
}