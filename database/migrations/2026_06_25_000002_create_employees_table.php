<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('Employees')) {
            Schema::create('Employees', function (Blueprint $table) {
                $table->id('Id');
                $table->unsignedBigInteger('UserId')->nullable();
                $table->string('Name');
                $table->string('Designation')->nullable();
                $table->string('District')->nullable();
                $table->string('Taluk')->nullable();
                $table->string('Lcode')->default('PRE-1');
                $table->string('Ccode')->default('PRE');
                $table->string('Status')->default('pending');
                $table->date('JoinedAt')->nullable();
                $table->timestamp('CreatedAt')->nullable();
                $table->timestamp('UpdatedAt')->nullable();

                $table->foreign('UserId')->references('id')->on('users')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('Employees');
    }
};
