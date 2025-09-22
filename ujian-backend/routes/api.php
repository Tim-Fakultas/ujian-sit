<?php

use App\Http\Controllers\BimbinganController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\FakultasController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\PejabatController;
use App\Http\Controllers\PengajuanController;
use App\Http\Controllers\ProdiController;
use App\Http\Controllers\SkripsiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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

Route::apiResource('pengajuan', PengajuanController::class);

Route::apiResource('prodi', ProdiController::class);

Route::apiResource('skripsi', SkripsiController::class);