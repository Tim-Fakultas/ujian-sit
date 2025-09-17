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
        Schema::create("dosen", function (Blueprint $table) {
            $table->id();
            $table->string("nidn")->unique();
            $table->string("nama");
            $table->string("no_hp", length: 30);
            $table->string("alamat");
            $table->foreignId("prodi_id")->constrained("prodi")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
