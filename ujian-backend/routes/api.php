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

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('mahasiswa')->group(function () {
    Route::get('/', [MahasiswaController::class, 'index']);          
    Route::get('/{id}', [MahasiswaController::class, 'show']);       
    Route::post('/', [MahasiswaController::class, 'store']);         
    Route::put('/{id}', [MahasiswaController::class, 'update']);     
    Route::delete('/{id}', [MahasiswaController::class, 'destroy']); 
});

Route::prefix('bimbingan')->group(function () {
    Route::get('/', [BimbinganController::class, 'index']);          
    Route::get('/{id}', [BimbinganController::class, 'show']);      
    Route::post('/', [BimbinganController::class, 'store']);         // POST /api/mahasiswa
    Route::put('/{id}', [BimbinganController::class, 'update']);     // PUT /api/mahasiswa/{id}
    Route::delete('/{id}', [BimbinganController::class, 'destroy']); // DELETE /api/mahasiswa/{id}
});

Route::prefix('dosen')->group(function () {
    Route::get('/', [DosenController::class, 'index']);          
    Route::get('/{id}', [DosenController::class, 'show']);       
    Route::post('/', [DosenController::class, 'store']);         
    Route::put('/{id}', [DosenController::class, 'update']);     
    Route::delete('/{id}', [DosenController::class, 'destroy']); 
});

Route::prefix('fakultas')->group(function () {
    Route::get('/', [FakultasController::class,'index']);
    Route::get('/{id}', [FakultasController::class,'show']);
    Route::post('/', [FakultasController::class,'store']);
    Route::put('/{id}', [FakultasController::class,'update']);
    Route::delete('/{id}', [FakultasController::class,'destroy']);
});

Route::prefix('pejabat')->group(function () {
    Route::get('/', [PejabatController::class,'index']);
    Route::get('/{id}', [PejabatController::class,'show']);
    Route::post('/', [PejabatController::class,'store']);
    Route::put('/{id}', [PejabatController::class,'update']);
    Route::delete('/{id}', [PejabatController::class,'destroy']);
});

Route::prefix('pengajuan')->group(function () {
    Route::get('/', [PengajuanController::class, 'index']);          
    Route::get('/{id}', [PengajuanController::class, 'show']);       
    Route::post('/', [PengajuanController::class, 'store']);         
    Route::put('/{id}', [PengajuanController::class, 'update']);     
    Route::delete('/{id}', [PengajuanController::class, 'destroy']); 
});

Route::prefix('prodi')->group(function () {
    Route::get('/', [ProdiController::class,'index']);
    Route::get('/{id}', [ProdiController::class,'show']);
    Route::post('/', [ProdiController::class,'store']);
    Route::put('/{id}', [ProdiController::class,'update']);
    Route::delete('/{id}', [ProdiController::class,'destroy']);
});

Route::prefix('skripsi')->group(function () {
    Route::get('/', [SkripsiController::class,'index']);
    Route::get('/{id}', [SkripsiController::class,'show']);
    Route::post('/', [SkripsiController::class,'store']);
    Route::put('/{id}', [SkripsiController::class,'update']);
    Route::delete('/{id}', [SkripsiController::class,'destroy']);
});