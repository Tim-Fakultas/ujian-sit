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
            $table->string('judul_penelitian');
            $table->text('masalah_dan_penyebab')->nullable();
            $table->text('alternatif_solusi')->nullable();
            $table->text('metode_penelitian')->nullable();
            $table->text('hasil_yang_diharapkan')->nullable();
            $table->text('kebutuhan_data')->nullable();
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
