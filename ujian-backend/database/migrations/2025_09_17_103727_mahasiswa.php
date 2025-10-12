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
        Schema::create('mahasiswa', function (Blueprint $table) {
            $table->id();
            $table->string('nim')->unique();
            $table->string('nama');
            $table->string('no_hp', 30);
            $table->string('alamat')->nullable();
            $table->foreignId('prodi_id')->default(1)->constrained('prodi')->onDelete('cascade');
            $table->foreignId('peminatan_id')->nullable()->constrained('peminatan')->onDelete('set null');
            $table->unsignedTinyInteger('semester')->default(1)->check('semester >= 1 AND semester <= 14');
            $table->decimal('ipk', 3, 2)->nullable()->default(0.00)->check('ipk >= 0.00 AND ipk <= 4.00');
            $table->unsignedBigInteger('dosen_pa')->nullable();
            $table->foreignId('pembimbing_1')->nullable()->constrained('dosen')->onDelete('set null');
            $table->foreignId('pembimbing_2')->nullable()->constrained('dosen')->onDelete('set null');
            $table->string('status')->default('aktif')->check("status IN ('aktif', 'cuti', 'lulus', 'nonaktif')");
            $table->string('angkatan', 4);
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mahasiswa');
    }
        // $table->string('foto')->nullable();
        // $table->string('email')->unique();
        // $table->date('tanggal_lahir')->nullable();
        // $table->string('tempat_lahir')->nullable();
        // $table->string('jenis_kelamin')->nullable();
        // $table->string('agama')->nullable();
        // $table->string('nama_ayah')->nullable();
        // $table->string('nama_ibu')->nullable();
};
