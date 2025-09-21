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
        Schema::create("skripsi", function (Blueprint $table) {
            $table->id();
            $table->foreignId("pengajuan_id")->constrained("pengajuan")->onDelete("cascade");
            $table->text("judul_skripsi");
            $table->text("identifikasi_masalah");
            $table->text("rumusan_masalah");
            $table->text("penelitian_sebelumnya");
            $table->text("pokok_masalah");
            $table->text("deskripsi_lengkap");
            $table->string("status")->default("proses");
            $table->date("tanggal_mulai")->useCurrent();
            $table->date("tanggal_selesai")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("skripsi");
    }
};
