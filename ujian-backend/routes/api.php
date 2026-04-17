<?php

/**
 * =============================================================================
 * API Routes — e-Skripsi Backend
 * =============================================================================
 *
 * Semua route di file ini otomatis mendapat prefix '/api'.
 * Autentikasi menggunakan Laravel Sanctum (Bearer Token).
 *
 * Pengelompokan:
 *   1. Autentikasi (login, logout, ubah password)
 *   2. Master Data (fakultas, prodi, peminatan, ruangan, jenis ujian, dll)
 *   3. Mahasiswa & Dosen
 *   4. Rancangan Penelitian (Ranpel) & Pengajuan
 *   5. Pendaftaran Ujian & Ujian
 *   6. Penilaian
 *   7. Perbaikan Judul
 *   8. Komentar (Review Proposal)
 *   9. Kaprodi (Route khusus Ketua Program Studi)
 */

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BerkasController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DaftarKehadiranController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\FakultasController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\JenisUjianController;
use App\Http\Controllers\KomponenPenilaianController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\PejabatController;
use App\Http\Controllers\PemenuhanSyaratController;
use App\Http\Controllers\PeminatanController;
use App\Http\Controllers\PendaftaranUjianController;
use App\Http\Controllers\PengajuanRanpelController;
use App\Http\Controllers\PenilaianController;
use App\Http\Controllers\PerbaikanJudulController;
use App\Http\Controllers\ProdiController;
use App\Http\Controllers\RanpelController;
use App\Http\Controllers\RuanganController;
use App\Http\Controllers\SkripsiController;
use App\Http\Controllers\SyaratController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\UjianController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| 1. Autentikasi
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user()->load('roles', 'permissions');
});

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:login');
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');
Route::post('/change-password', [AuthController::class, 'changePassword'])
    ->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| 2. Master Data
|--------------------------------------------------------------------------
*/

Route::apiResource('fakultas', FakultasController::class);
Route::apiResource('prodi', ProdiController::class);
Route::apiResource('peminatan', PeminatanController::class);
Route::apiResource('ruangan', RuanganController::class);
Route::apiResource('jenis-ujian', JenisUjianController::class);
Route::apiResource('komponen-penilaian', KomponenPenilaianController::class);
Route::apiResource('syarat', SyaratController::class);
Route::apiResource('template', TemplateController::class);
Route::apiResource('pejabat', PejabatController::class);
Route::apiResource('faqs', FaqController::class);

/*
|--------------------------------------------------------------------------
| 3. Mahasiswa & Dosen
|--------------------------------------------------------------------------
*/

Route::apiResource('mahasiswa', MahasiswaController::class);

Route::get('dosen/monitor-bimbingan', [DosenController::class, 'monitorBimbingan']);
Route::get('dosen/{id}/bimbingan', [DosenController::class, 'getBimbinganDetails']);
Route::apiResource('dosen', DosenController::class);

/*
|--------------------------------------------------------------------------
| 4. Rancangan Penelitian (Ranpel) & Pengajuan
|--------------------------------------------------------------------------
*/

Route::apiResource('ranpel', RanpelController::class);
Route::apiResource('pengajuan-ranpel', PengajuanRanpelController::class);

/*
|--------------------------------------------------------------------------
| 5. Pendaftaran Ujian & Ujian
|--------------------------------------------------------------------------
*/

Route::apiResource('pendaftaran-ujian', PendaftaranUjianController::class);
Route::apiResource('ujian', UjianController::class);
Route::apiResource('skripsi', SkripsiController::class);
Route::apiResource('pemenuhan-syarat', PemenuhanSyaratController::class);
Route::apiResource('daftar-hadir', DaftarKehadiranController::class);
Route::apiResource('berkas', BerkasController::class);

/*
|--------------------------------------------------------------------------
| 6. Penilaian
|--------------------------------------------------------------------------
*/

Route::apiResource('penilaian', PenilaianController::class);

/*
|--------------------------------------------------------------------------
| 7. Perbaikan Judul
|--------------------------------------------------------------------------
*/

Route::apiResource('perbaikan-judul', PerbaikanJudulController::class);
Route::get('/dosen/{id}/perbaikan-judul', [PerbaikanJudulController::class, 'getByDosenPa']);

/*
|--------------------------------------------------------------------------
| 8. Route Mahasiswa (Nested: /mahasiswa/{id}/...)
|--------------------------------------------------------------------------
| Route khusus untuk operasi yang terikat pada mahasiswa tertentu.
*/

Route::prefix('mahasiswa/{id}')->group(function () {
    // Pengajuan Ranpel
    Route::get('pengajuan-ranpel', [PengajuanRanpelController::class, 'getByMahasiswa']);
    Route::post('pengajuan-ranpel', [PengajuanRanpelController::class, 'storeByMahasiswa']);
    Route::put('pengajuan-ranpel/{pengajuan}', [PengajuanRanpelController::class, 'updateByMahasiswa']);
    Route::delete('pengajuan-ranpel/{pengajuan}', [PengajuanRanpelController::class, 'destroyByMahasiswa']);

    // Ranpel
    Route::get('/ranpel', [RanpelController::class, 'getByMahasiswa']);
    Route::post('/ranpel', [RanpelController::class, 'storeByMahasiswa']);
    Route::put('/ranpel/{ranpel}', [RanpelController::class, 'updateByMahasiswa']);

    // Perbaikan Judul
    Route::get('/perbaikan-judul', [PerbaikanJudulController::class, 'getByMahasiswa']);

    // Pendaftaran Ujian
    Route::get('/pendaftaran-ujian', [PendaftaranUjianController::class, 'getByMahasiswa']);
    Route::get('/pendaftaran-ujian/{pendaftaran}', [PendaftaranUjianController::class, 'showByMahasiswa']);
    Route::post('/pendaftaran-ujian', [PendaftaranUjianController::class, 'storeByMahasiswa']);
    Route::put('/pendaftaran-ujian/{pendaftaran}', [PendaftaranUjianController::class, 'updateByMahasiswa']);
    Route::delete('/pendaftaran-ujian/{pendaftaran}', [PendaftaranUjianController::class, 'destroyByMahasiswa']);

    // Ujian
    Route::get('/ujian', [UjianController::class, 'getByMahasiswa']);
});

/*
|--------------------------------------------------------------------------
| 9. Komentar (Review Proposal)
|--------------------------------------------------------------------------
*/

Route::get('/comments', [CommentController::class, 'index']);
Route::post('/comments', [CommentController::class, 'store']);
Route::patch('/comments/{id}/resolve', [CommentController::class, 'resolve']);
Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 10. Kaprodi (Ketua Program Studi)
|--------------------------------------------------------------------------
| Route khusus untuk role Kaprodi, dilindungi middleware auth + role.
*/

Route::prefix('kaprodi')->middleware(['auth:sanctum', 'role:kaprodi'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Kaprodi\DashboardController::class, 'index']);
    Route::get('/pengajuan-ranpel', [\App\Http\Controllers\Kaprodi\PengajuanRanpelController::class, 'index']);
    Route::post('/pengajuan-ranpel/{id}/approve', [\App\Http\Controllers\Kaprodi\PengajuanRanpelController::class, 'approve']);
    Route::post('/pengajuan-ranpel/{id}/reject', [\App\Http\Controllers\Kaprodi\PengajuanRanpelController::class, 'reject']);
    Route::post('/pengajuan-ranpel/{id}/catatan', [\App\Http\Controllers\Kaprodi\PengajuanRanpelController::class, 'updateCatatan']);
    Route::get('/jadwal-ujian', [\App\Http\Controllers\Kaprodi\JadwalUjianController::class, 'index']);
});
