# Report: Penambahan Halaman Mahasiswa PA (Dosen)

## Ringkasan Perubahan

Telah ditambahkan fitur baru bagi dosen untuk melihat daftar mahasiswa yang berada di bawah bimbingan akademik mereka (PA) beserta status pengajuan Rancangan Penelitian (Ranpel) masing-masing mahasiswa.

### 1. Backend (Laravel)

- **File**: `ujian-backend/app/Http/Controllers/DosenController.php`
- **Perubahan**: Memodifikasi method `getBimbinganDetails` untuk menyertakan informasi:
  - `sudah_ranpel` (boolean): Menandakan apakah mahasiswa sudah pernah mengajukan ranpel.
  - `ranpel_status` (string): Status terbaru dari pengajuan ranpel (misal: 'diterima', 'ditolak', 'sedang diproses', atau 'Belum mengajukan').

### 2. Frontend (Next.js)

- **Komponen**: `ujian-frontend/src/components/dosen/mahasiswa-pa/MahasiswaPaTable.tsx`
  - Menampilkan tabel mahasiswa PA dengan kolom Nama, NIM, Prodi, Angkatan, **Status Ranpel**, Status Akademik, dan **Aksi**.
  - Memberikan indikator visual (Badge) untuk membedakan mahasiswa yang sudah dan belum mengajukan ranpel.
  - **Fitur Baru**: Menambahkan kolom **Aksi** dengan tombol "Lihat Detail" (ikon mata) untuk menampilkan profil/detail mahasiswa dalam modal.
  - Dilengkapi fitur pencarian dan filter angkatan.
  - Modal detail untuk melihat rincian mahasiswa termasuk judul penelitian terakhir.
- **Halaman**: `ujian-frontend/src/app/(routes)/dosen/mahasiswa-pa/page.tsx`
  - Route baru `/dosen/mahasiswa-pa`.
  - Mengambil data dari endpoint bimbingan dosen yang sedang login.
- **Navigasi**: `ujian-frontend/src/components/app-sidebar-client.tsx`
  - Menambahkan menu "Mahasiswa PA" pada bagian Skripsi untuk user dengan role Dosen.

## Cara Verifikasi

1. Login sebagai **Dosen**.
2. Buka menu **Skripsi** di sidebar.
3. Pilih menu **Mahasiswa PA**.
4. Verifikasi bahwa daftar mahasiswa yang tampil adalah mahasiswa PA rekan dosen tersebut, dan kolom **Status Ranpel** menunjukkan kondisi yang sesuai (Sudah/Belum Mengajukan).

---

_Dibuat oleh Assistant pada 10 Februari 2026._
