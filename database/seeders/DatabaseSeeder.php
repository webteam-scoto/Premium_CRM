<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin (email + password login, password hashed)
        $superAdminExists = DB::table('users')->where('email', 'aravindsiddharthp@gmail.com')->exists();
        if (!$superAdminExists) {
            DB::table('users')->insert([
                'name'       => 'Super Admin',
                'email'      => 'aravindsiddharthp@gmail.com',
                'password'   => 'siddhu@1310',
                'role'       => 'super_admin',
                'Status'     => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // System Admin (email + password login, password non-hashed stored as plain, bcrypt for auth)
        $systemAdminExists = DB::table('users')->where('email', 'systemadmin@premiercrm.com')->exists();
        if (!$systemAdminExists) {
            DB::table('users')->insert([
                'name'       => 'System Admin',
                'email'      => 'salmanparis@gmail.com',
                'password'   => 'salman@123',
                'role'       => 'system_admin',
                'Status'     => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
