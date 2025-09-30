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
        Schema::create('ranpel', function (Blueprint $table) {
            $table->id();
            $table->foreignId("pengajuan_judul_id")->constrained("pengajuan_judul")->onDelete("cascade");
            $table->foreign('judul')->references('id')->on('judul')->onDelete('cascade');
            $table->text("identifikasi_masalah");
            $table->text("rumusan_masalah");
            $table->text("penelitian_sebelumnya");
            $table->text("pokok_masalah");
            $table->text("deskripsi_lengkap");
            $table->enum("status", ["menunggu", "disetujui", "ditolak"])->default("menunggu");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ranpel');
    }
};
