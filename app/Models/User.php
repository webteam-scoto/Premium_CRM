<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role',
        'District', 'Taluk', 'Lcode', 'Ccode', 'Status',
        'phone', 'dob',
    ];

    protected $hidden = ['password', 'remember_token'];

    // No hashed cast — passwords stored plain for admin/end_user, bcrypt for super/system admin
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }
}
