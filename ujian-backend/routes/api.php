<?php
use App\Http\Controllers\RuanganController;
?><?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BimbinganController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\FakultasController;
use App\Http\Controllers\JadwalPengujiController;
use App\Http\Controllers\JenisUjianController;
use App\Http\Controllers\JudulController;
use App\Http\Controllers\KomponenPenilaianController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\PejabatController;
use App\Http\Controllers\PemenuhanSyaratController;
use App\Http\Controllers\PeminatanController;
use App\Http\Controllers\PendaftaranUjianController;
use App\Http\Controllers\PengajuanJudulController;
use App\Http\Controllers\PengajuanRanpelController;
use App\Http\Controllers\PenilaianController;
use App\Http\Controllers\ProdiController;
use App\Http\Controllers\RanpelController;
use App\Http\Controllers\SkripsiController;
use App\Http\Controllers\SyaratController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\UjianController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::apiResource('mahasiswa', MahasiswaController::class);

Route::apiResource('bimbingan', BimbinganController::class);

Route::apiResource('dosen', DosenController::class);

Route::apiResource('fakultas', FakultasController::class);

Route::apiResource('pejabat', PejabatController::class);

// Route::apiResource('pengajuan-judul', PengajuanJudulController::class);

Route::apiResource('prodi', ProdiController::class);

Route::apiResource('peminatan', PeminatanController::class);

Route::apiResource('skripsi', SkripsiController::class);

Route::apiResource('jenis-ujian', JenisUjianController::class);

Route::apiResource('komponen-penilaian', KomponenPenilaianController::class);

Route::apiResource('pemenuhan-syarat', PemenuhanSyaratController::class);

Route::apiResource('pendaftaran-ujian', PendaftaranUjianController::class);

Route::apiResource('penilaian', PenilaianController::class);

Route::apiResource('ranpel', RanpelController::class);

Route::apiResource('syarat', SyaratController::class);

Route::apiResource('template', TemplateController::class);

Route::apiResource('ujian', UjianController::class);

Route::apiResource('jadwal-penguji', JadwalPengujiController::class);

Route::apiResource('ruangan', RuanganController::class);

// Route::apiResource('judul', JudulController::class);

Route::apiResource('pengajuan-ranpel', PengajuanRanpelController::class);

Route::prefix('mahasiswa/{id}')->group(function () {
    //pengajuan-ranpel
    Route::get('pengajuan-ranpel', [PengajuanRanpelController::class, 'getByMahasiswa']);
    Route::post('pengajuan-ranpel', [PengajuanRanpelController::class, 'storeByMahasiswa']);
    Route::put('pengajuan-ranpel/{pengajuan}', [PengajuanRanpelController::class, 'updateByMahasiswa']);
    Route::delete('pengajuan-ranpel/{pengajuan}', [PengajuanRanpelController::class, 'destroyByMahasiswa']);

    //ranpel
    Route::get('/ranpel', [RanpelController::class, 'getByMahasiswa']);
    Route::post('/ranpel', [RanpelController::class, 'storeByMahasiswa']);

    //pendaftaran-ujian
    Route::get('/pendaftaran-ujian', [PendaftaranUjianController::class, 'getByMahasiswa']);
    Route::get('/pendaftaran-ujian/{pendaftaran}', [PendaftaranUjianController::class, 'showByMahasiswa']); // satu
    Route::post('/pendaftaran-ujian', [PendaftaranUjianController::class, 'storeByMahasiswa']);
    Route::put('/pendaftaran-ujian/{pendaftaran}', [PendaftaranUjianController::class, 'updateByMahasiswa']);
    Route::delete('/pendaftaran-ujian/{pendaftaran}', [PendaftaranUjianController::class, 'destroyByMahasiswa']);
});

