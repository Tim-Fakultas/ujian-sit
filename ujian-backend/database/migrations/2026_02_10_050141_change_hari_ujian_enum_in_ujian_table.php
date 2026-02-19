<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Change to string temporarily
        Schema::table('ujian', function (Blueprint $table) {
            $table->string('hari_ujian')->nullable()->change();
        });

        // 2. Capitalize existing data
        DB::statement("UPDATE ujian SET hari_ujian = CONCAT(UPPER(SUBSTRING(hari_ujian, 1, 1)), SUBSTRING(hari_ujian, 2)) WHERE hari_ujian IS NOT NULL AND hari_ujian != ''");

        // 3. Change back to capitalized ENUM
        Schema::table('ujian', function (Blueprint $table) {
            $table->enum('hari_ujian', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'])->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ujian', function (Blueprint $table) {
            $table->string('hari_ujian')->nullable()->change();
        });

        DB::statement("UPDATE ujian SET hari_ujian = LOWER(hari_ujian) WHERE hari_ujian IS NOT NULL AND hari_ujian != ''");

        Schema::table('ujian', function (Blueprint $table) {
            $table->enum('hari_ujian', ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'])->nullable()->change();
        });
    }
};
