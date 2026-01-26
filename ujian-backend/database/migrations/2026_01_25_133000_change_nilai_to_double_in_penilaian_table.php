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
        Schema::table('penilaian', function (Blueprint $table) {
            // Mengubah tipe kolom nilai menjadi double dengan presisi (8,2)
            // 8 digit total, 2 di belakang koma. Contoh: 100.00
            $table->double('nilai', 8, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penilaian', function (Blueprint $table) {
            // Mengembalikan ke integer jika di-rollback
            $table->integer('nilai')->change();
        });
    }
};
