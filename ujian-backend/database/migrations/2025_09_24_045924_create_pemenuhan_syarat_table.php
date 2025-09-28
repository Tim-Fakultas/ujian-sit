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
        Schema::create('pemenuhan_syarat', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengajuan_judul_id')->constrained('pengajuan_judul')->onDelete('cascade');
            $table->foreignId('syarat_id')->constrained('syarat')->onDelete('cascade');
            $table->string('file_path');
            $table->string('file_name');
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('mime_type')->nullable();
            $table->string('keterangan')->nullable();
            $table->enum('status', ['menunggu', 'valid', 'invalid'])->default('menunggu');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemenuhan_syarat');
    }
};
