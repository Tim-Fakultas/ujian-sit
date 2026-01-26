<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pengajuan_ranpel', function (Blueprint $table) {
            $table->dateTime('tanggal_diverifikasi')->nullable()->after('tanggal_pengajuan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengajuan_ranpel', function (Blueprint $table) {
            $table->dropColumn('tanggal_diverifikasi');
        });
    }
};
