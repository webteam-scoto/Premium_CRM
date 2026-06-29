<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $table = 'Employees';

    protected $fillable = [
        'UserId', 'Name', 'Designation', 'District',
        'Taluk', 'Status', 'JoinedAt', 'Lcode', 'Ccode',
    ];

    const CREATED_AT = 'CreatedAt';
    const UPDATED_AT = 'UpdatedAt';

    protected $casts = [
        'JoinedAt' => 'date',
    ];

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->Lcode = $model->Lcode ?? 'PRE-1';
            $model->Ccode = $model->Ccode ?? 'PRE';
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'UserId');
    }
}