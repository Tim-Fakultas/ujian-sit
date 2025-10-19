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
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->onDelete('cascade');
            $table->foreignId('jenis_ujian_id')->constrained('jenis_ujian')->onDelete('cascade');
            $table->enum('hari_ujian', ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'])->nullable();
            $table->dateTime('jadwal_ujian')->nullable();
            $table->time('waktu_mulai')->nullable();
            $table->time('waktu_selesai')->nullable();
            $table->string('ruangan')->nullable();
            $table->foreignId('ketua_penguji')->nullable()->constrained('dosen')->nullOnDelete();
            $table->foreignId('sekretaris_penguji')->nullable()->constrained('dosen')->nullOnDelete();
            $table->foreignId('penguji_1')->nullable()->constrained('dosen')->nullOnDelete();
            $table->foreignId('penguji_2')->nullable()->constrained('dosen')->nullOnDelete();
            $table->enum('hasil', ['lulus', 'tidak lulus'])->nullable();
            $table->unsignedBigInteger('nilai_akhir')->nullable();
            $table->enum('keputusan', ['Dapat diterima tanpa perbaikan',
                                                        'Dapat diterima dengan perbaikan kecil',
                                                        'Dapat diterima dengan perbaikan besar',
                                                        'Belum dapat diterima'])->nullable();
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
