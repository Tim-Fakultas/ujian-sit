// export const statusColors = {
//   disetujui:
//     "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800",
//   pending:
//     "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
//   ditolak:
//     "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800",
// };

import { Bimbingan } from "@/types/Bimbingan";
import { Ujian } from "@/types/Ujian";

export const ujianData: Ujian[] = [
  {
    id: 1,
    nim: "230112233",
    nama: "Andi Wijaya",
    waktu: "2025-03-10 09:00",
    ruang: "Ruang A101",
    judul: "Implementasi Blockchain untuk Sistem Akademik",
    ketuaPenguji: "Dr. Budi Santoso",
    sekretarisPenguji: "Dr. Siti Aminah",
    penguji1: "Dr. Andi Wijaya",
    penguji2: "Dr. Rina Kurnia",
    jenis: "Seminar Proposal",
    nilai: "-",
    status: "dijadwalkan",
  },
  {
    id: 2,
    nim: "230445566",
    nama: "Dewi Lestari",
    waktu: "2025-03-15 13:00",
    ruang: "Ruang B202",
    judul:
      "Aplikasi Absensi Mahasiswa Berbasis QR Code dengan Integrasi Sistem Presensi Akademik",
    ketuaPenguji: "Dr. Andi Wijaya",
    sekretarisPenguji: "Dr. Siti Aminah",
    penguji1: "Dr. Budi Santoso",
    penguji2: "Dr. Rina Kurnia",
    jenis: "Seminar Skripsi",
    nilai: "A-",
    status: "selesai",
  },
  {
    id: 3,
    nim: "230778899",
    nama: "Budi Santoso",
    waktu: "2025-03-20 10:00",
    ruang: "Ruang C303",
    judul: "Sistem Informasi Manajemen Perpustakaan Berbasis Web",
    ketuaPenguji: "Dr. Siti Aminah",
    sekretarisPenguji: "Dr. Rina Kurnia",
    penguji1: "Dr. Budi Santoso",
    penguji2: "Dr. Ahmad Fauzi",
    jenis: "Seminar Hasil",
    nilai: "B+",
    status: "selesai",
  },
  {
    id: 4,
    nim: "230334455",
    nama: "Sari Indah",
    waktu: "2025-03-25 14:00",
    ruang: "Ruang D404",
    judul: "Machine Learning untuk Prediksi Nilai Mahasiswa",
    ketuaPenguji: "Dr. Ahmad Fauzi",
    sekretarisPenguji: "Dr. Budi Santoso",
    penguji1: "Dr. Siti Aminah",
    penguji2: "Dr. Rina Kurnia",
    jenis: "Seminar Proposal",
    nilai: "-",
    status: "pending",
  },
  {
    id: 5,
    nim: "230556677",
    nama: "Ahmad Rizky",
    waktu: "2025-03-30 11:00",
    ruang: "Ruang E505",
    judul: "Sistem Keamanan IoT menggunakan Teknologi Blockchain",
    ketuaPenguji: "Dr. Rina Kurnia",
    sekretarisPenguji: "Dr. Ahmad Fauzi",
    penguji1: "Dr. Budi Santoso",
    penguji2: "Dr. Siti Aminah",
    jenis: "Seminar Proposal",
    nilai: "-",
    status: "dijadwalkan",
  },
  {
    id: 6,
    nim: "230667788",
    nama: "Nurul Fatimah",
    waktu: "2025-04-05 08:30",
    ruang: "Ruang F606",
    judul: "Aplikasi Mobile untuk Monitoring Kesehatan Mental Mahasiswa",
    ketuaPenguji: "Dr. Siti Aminah",
    sekretarisPenguji: "Dr. Budi Santoso",
    penguji1: "Dr. Ahmad Fauzi",
    penguji2: "Dr. Andi Wijaya",
    jenis: "Seminar Hasil",
    nilai: "A",
    status: "selesai",
  },
  {
    id: 7,
    nim: "230889900",
    nama: "Rudi Hartono",
    waktu: "2025-04-10 15:00",
    ruang: "Ruang G707",
    judul: "Optimasi Algoritma Genetika untuk Penjadwalan Mata Kuliah",
    ketuaPenguji: "Dr. Ahmad Fauzi",
    sekretarisPenguji: "Dr. Rina Kurnia",
    penguji1: "Dr. Siti Aminah",
    penguji2: "Dr. Budi Santoso",
    jenis: "Seminar Skripsi",
    nilai: "B",
    status: "selesai",
  },
];

export const statusColors = {
  pending: "bg-orange-100 text-orange-700",
  dijadwalkan: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
};

export const statusLabels = {
  pending: "Menunggu",
  dijadwalkan: "Dijadwalkan",
  selesai: "Selesai",
};




export const bimbinganData: Bimbingan[] = [
  {
    id: 1,
    jenis: "Proposal",
    judul: "Implementasi Blockchain untuk Sistem Akademik",
    dospem1: "Dr. Budi Santoso",
    dospem2: "Dr. Siti Aminah",
    status: "diterima",
    tanggal: "2025-02-15",
  },
  {
    id: 2,
    jenis: "Skripsi",
    judul: "Aplikasi Absensi Mahasiswa Berbasis QR Code",
    dospem1: "Dr. Siti Aminah",
    dospem2: "Dr. Andi Wijaya",
    status: "menunggu",
    tanggal: "2025-03-01",
  },
  {
    id: 3,
    jenis: "Proposal",
    judul: "Sistem Rekomendasi Film dengan Machine Learning",
    dospem1: "Dr. Rina Kurnia",
    dospem2: "Dr. Ahmad Fauzi",
    status: "ditolak",
    tanggal: "2025-03-10",
  },
];
