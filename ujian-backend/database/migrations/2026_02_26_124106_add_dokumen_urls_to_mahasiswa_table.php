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
        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->string('url_transkrip_nilai')->nullable()->after('url_ktm');
            $table->string('url_bukti_lulus_metopen')->nullable()->after('url_transkrip_nilai');
            $table->string('url_sertifikat_bta')->nullable()->after('url_bukti_lulus_metopen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->dropColumn(['url_transkrip_nilai', 'url_bukti_lulus_metopen', 'url_sertifikat_bta']);
        });
    }
};
