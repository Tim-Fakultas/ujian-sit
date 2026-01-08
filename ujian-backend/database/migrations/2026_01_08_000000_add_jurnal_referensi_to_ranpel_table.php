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
        Schema::table('ranpel', function (Blueprint $table) {
            $table->text('jurnal_referensi')->nullable()->after('kebutuhan_data');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ranpel', function (Blueprint $table) {
            $table->dropColumn('jurnal_referensi');
        });
    }
};
