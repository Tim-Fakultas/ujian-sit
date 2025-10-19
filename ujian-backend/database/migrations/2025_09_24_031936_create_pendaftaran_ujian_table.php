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
        Schema::create('pendaftaran_ujian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->onDelete('cascade');
            $table->foreignId('ranpel_id')->constrained('ranpel')->onDelete('cascade');
            $table->foreignId('jenis_ujian_id')->constrained('jenis_ujian')->onDelete('cascade');
            $table->dateTime('tanggal_pengajuan')->default(now());
            $table->dateTime('tanggal_disetujui')->nullable();
            $table->enum('status', ['menunggu','diterima','dijadwalkan', 'selesai', 'ditolak'])->default('menunggu');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_ujian');
    }
};
