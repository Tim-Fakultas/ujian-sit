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
        Schema::create('bimbingan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('skripsi_id')->constrained('skripsi')->onDelete('cascade');
            $table->foreignId('dosen_id')->constrained('dosen')->onDelete('cascade'); // pembimbing yg dituju
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->onDelete('cascade'); // pengaju
            $table->text('keterangan'); // isi pengajuan bimbingan (pertanyaan, draft, dll)
            $table->string('file_path')->nullable(); // kalau ada upload file
            $table->enum('status', ['diajukan', 'diterima', 'direvisi', 'selesai'])->default('diajukan');
            $table->timestamps(); // tambah kolom created_at dan updated_at
            // harusnya ada tanggal bimbingan tapi lupa nambahinnya
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bimbingan');
    }
};
