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
        Schema::create("pengajuan", function (Blueprint $table) {
            $table->id();
            $table->foreignId("mahasiswa_id")->constrained("mahasiswa")->onDelete("cascade");
            $table->string("judul_skripsi");
            $table->date("tanggal_pengajuan");
            $table->date("tanggal_disetujui")->nullable();
            $table->string("status")->default("pending");
            $table->text("keterangan")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("pengajuan");
    }
};
