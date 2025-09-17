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
        Schema::create("bimbingan", function (Blueprint $table) {
            $table->id();
            $table->foreignId("skripsi_id")->constrained("skripsi")->onDelete("cascade");
            $table->foreignId("mahasiswa_id")->constrained("mahasiswa")->onDelete("cascade");
            $table->foreignId("pembimbing_1")->constrained("dosen")->onDelete("cascade");
            $table->foreignId("pembimbing_2")->constrained("dosen")->onDelete("cascade");
            $table->text("keterangan");
            $table->timestamps();
            //harusnya ada tanggal bimbingan tapi lupa nambahinnya
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("bimbingan");
    }
};
