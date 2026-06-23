<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'name'       => 'Super Admin',
            'email'      => 'aravindsiddharthp@gmail.com',
            'password'   => Hash::make('siddhu@1310'),
            'role'       => 'super_admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}