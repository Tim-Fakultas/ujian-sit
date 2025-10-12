<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dosen', function (Blueprint $table) {
            $table->id();
            $table->string('nidn')->unique()->nullable();
            $table->string('nip')->unique()->nullable();
            $table->string('nama');
            $table->string('no_hp', 30)->nullable();
            $table->string('alamat')->nullable();
            $table->string('tempat_tanggal_lahir')->nullable();
            $table->string('pangkat')->nullable();
            $table->string('golongan')->nullable();
            $table->dateTime('tmt_fst')->nullable();
            $table->string('jabatan')->nullable();
            $table->foreignId('prodi_id')->constrained('prodi')->onDelete('cascade');
            $table->string('foto')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dosen');
    }
};
