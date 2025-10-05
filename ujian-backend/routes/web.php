<?php

use App\Http\Controllers\BimbinganController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\FakultasController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\PejabatController;
use App\Http\Controllers\ProdiController;
use App\Http\Controllers\SkripsiController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/mahasiswa', [MahasiswaController::class, 'index']);
Route::get('/dosen', [DosenController::class, 'index']);
Route::get('/bimbingan', [BimbinganController::class, 'index']);
Route::get('/fakultas', [FakultasController::class, 'index']);
Route::get('/pejabat', [PejabatController::class, 'index']);
Route::get('/prodi', [ProdiController::class, 'index']);
Route::get('/skripsi', [SkripsiController::class, 'index']);
