<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('employee_mst')) {
            Schema::create('employee_mst', function (Blueprint $table) {
                $table->id('Id');
                $table->unsignedBigInteger('UserId')->nullable();
                $table->string('Name');
                $table->string('Designation')->nullable();
                $table->string('District')->nullable();
                $table->string('Taluk')->nullable();
                $table->string('Lcode')->default('PRE-1');
                $table->string('Ccode')->default('PRE');
                $table->string('Role')->default('admin');   // admin or end_user
                $table->string('Status')->default('pending');
                $table->date('JoinedAt')->nullable();
                $table->timestamp('CreatedAt')->nullable();
                $table->timestamp('UpdatedAt')->nullable();

                $table->foreign('UserId')->references('id')->on('users')->onDelete('set null');
            });
        } else {
            // Add Role column if table exists but column missing
            if (!Schema::hasColumn('employee_mst', 'Role')) {
                Schema::table('employee_mst', function (Blueprint $table) {
                    $table->string('Role')->default('admin');
                });
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_mst');
    }
};