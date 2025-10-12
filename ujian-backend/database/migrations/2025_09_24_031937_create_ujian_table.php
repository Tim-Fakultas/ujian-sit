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
        Schema::create('ujian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_ujian_id')->constrained('pendaftaran_ujian')->onDelete('cascade');
            $table->foreignId('jenis_ujian_id')->constrained('jenis_ujian')->onDelete('cascade');
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->onDelete('cascade');
            $table->dateTime('jadwal_ujian')->nullable();
            $table->time('waktu_mulai')->nullable();
            $table->time('waktu_selesai')->nullable();
            $table->string('ruangan')->nullable();
            // $table->enum('status', ['dijadwalkan', 'selesai', 'dibatalkan'])->default('dijadwalkan');
            $table->foreignId('penguji_1')->nullable()->constrained('dosen')->nullOnDelete();
            $table->foreignId('penguji_2')->nullable()->constrained('dosen')->nullOnDelete();
            $table->enum('hasil', ['lulus', 'tidak lulus'])->nullable();
            $table->unsignedBigInteger('nilai')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ujian');
    }
};
