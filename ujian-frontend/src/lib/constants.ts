import { Bimbingan } from "@/types/Bimbingan";
import { Rancangan } from "@/types/Rancangan";
import { Ujian } from "@/types/Ujian";
import { PengajuanUjianAdmin } from "@/types/PengajuanUjianAdmin";

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

// Data Dosen PA
export const dosenPAData = [
  {
    id: 1,
    nama: "Dr. Indah Hidayanti, M.Kom",
    nip: "198501012010122001",
  },
  {
    id: 2,
    nama: "Dr. Budi Santoso, M.T",
    nip: "197803152005011002",
  },
  {
    id: 3,
    nama: "Dr. Siti Aminah, M.Kom",
    nip: "198209102008122003",
  },
  {
    id: 4,
    nama: "Dr. Andi Wijaya, M.T",
    nip: "197512201999031001",
  },
  {
    id: 5,
    nama: "Dr. Rina Kurnia, M.Kom",
    nip: "198706152012122002",
  },
];

// Data Mahasiswa (contoh untuk form)
export const mahasiswaData = {
  nama: "Ahmad Rizki Pratama",
  nim: "2021001",
  semester: 7, // Semester saat ini
  angkatan: 2021,
  // Status progres akademik lengkap
  progressAkademik: {
    // Tahap 1: Prasyarat
    minimumSemester: true, // Semester >= 6
    ipkMemenuhi: true, // IPK >= 2.5
    sksTerpenuhi: true, // SKS >= 120

    // Tahap 2: Persiapan
    judulDisetujui: true, // Judul skripsi disetujui
    dosenPembimbingDitetapkan: true, // Dosen pembimbing sudah ada

    // Tahap 3: Penelitian & Ujian
    seminarProposal: true,
    seminarHasil: false,
    ujianSkripsi: false,

    // Tahap 4: Finalisasi
    revisiSelesai: false,
    yudisium: false,
    wisuda: false,
  },
  // Detail tambahan
  ipk: 3.45,
  sksLulus: 142,
  dosenPembimbing: "Dr. Indah Hidayanti, M.Kom",
  judulSkripsi: "Implementasi Machine Learning untuk Prediksi Nilai Mahasiswa",
};

// Contoh data mahasiswa dengan kondisi berbeda untuk testing
export const contohMahasiswaData = {
  // Mahasiswa semester 5 (belum bisa sempro)
  mahasiswaSem5: {
    nama: "Budi Santoso",
    nim: "2022001",
    semester: 5,
    angkatan: 2022,
    progressAkademik: {
      minimumSemester: false,
      ipkMemenuhi: true,
      sksTerpenuhi: false,
      judulDisetujui: false,
      dosenPembimbingDitetapkan: false,
      seminarProposal: false,
      seminarHasil: false,
      ujianSkripsi: false,
      revisiSelesai: false,
      yudisium: false,
      wisuda: false,
    },
    ipk: 3.2,
    sksLulus: 98,
    dosenPembimbing: "",
    judulSkripsi: "",
  },
  // Mahasiswa yang sudah sempro
  mahasiswaSudahSempro: {
    nama: "Siti Aisyah",
    nim: "2020001",
    semester: 8,
    angkatan: 2020,
    progressAkademik: {
      minimumSemester: true,
      ipkMemenuhi: true,
      sksTerpenuhi: true,
      judulDisetujui: true,
      dosenPembimbingDitetapkan: true,
      seminarProposal: true,
      seminarHasil: false,
      ujianSkripsi: false,
      revisiSelesai: false,
      yudisium: false,
      wisuda: false,
    },
    ipk: 3.67,
    sksLulus: 145,
    dosenPembimbing: "Dr. Budi Santoso, M.T",
    judulSkripsi: "Sistem Informasi Manajemen Berbasis Web",
  },
  // Mahasiswa yang sudah semhas
  mahasiswaSudahSemhas: {
    nama: "Dedi Setiawan",
    nim: "2019001",
    semester: 8,
    angkatan: 2019,
    progressAkademik: {
      minimumSemester: true,
      ipkMemenuhi: true,
      sksTerpenuhi: true,
      judulDisetujui: true,
      dosenPembimbingDitetapkan: true,
      seminarProposal: true,
      seminarHasil: true,
      ujianSkripsi: false,
      revisiSelesai: false,
      yudisium: false,
      wisuda: false,
    },
    ipk: 3.78,
    sksLulus: 148,
    dosenPembimbing: "Dr. Siti Aminah, M.Kom",
    judulSkripsi: "Aplikasi Mobile untuk Sistem Akademik",
  },
  // Mahasiswa yang sudah lulus semua
  mahasiswaLulus: {
    nama: "Rina Kartika",
    nim: "2018001",
    semester: 8,
    angkatan: 2018,
    progressAkademik: {
      minimumSemester: true,
      ipkMemenuhi: true,
      sksTerpenuhi: true,
      judulDisetujui: true,
      dosenPembimbingDitetapkan: true,
      seminarProposal: true,
      seminarHasil: true,
      ujianSkripsi: true,
      revisiSelesai: true,
      yudisium: true,
      wisuda: false,
    },
    ipk: 3.89,
    sksLulus: 150,
    dosenPembimbing: "Dr. Andi Wijaya, M.T",
    judulSkripsi: "AI untuk Deteksi Penyakit Tanaman",
  },
};

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

export const rancanganData: Rancangan[] = [
  {
    id: 1,
    judul: "Implementasi Blockchain untuk Sistem Akademik",
    tanggalDiajukan: "2025-03-01",
    tanggalDiverifikasi: "2025-03-05",
    status: "disetujui",
    masalah:
      "Keamanan data akademik masih lemah dan rentan terhadap manipulasi data. Sistem saat ini tidak memiliki jejak audit yang memadai untuk melacak perubahan data akademik. Hal ini dapat menimbulkan ketidakpercayaan stakeholder terhadap integritas data akademik institusi.",
    solusi:
      "Menggunakan teknologi blockchain untuk memastikan integritas dan transparansi data akademik. Implementasi smart contract untuk otomatisasi proses verifikasi dan validasi data. Penggunaan hash cryptographic untuk memastikan data tidak dapat dimanipulasi.",
    hasil:
      "Sistem akademik yang lebih transparan, aman, dan memiliki jejak audit yang lengkap. Meningkatkan kepercayaan stakeholder terhadap integritas data akademik. Otomatisasi proses verifikasi yang mengurangi human error.",
    kebutuhan:
      "Data mahasiswa, data nilai, data kehadiran, data transkrip akademik, dan data sertifikat. Data historis untuk migration ke sistem blockchain.",
    metode:
      "Studi literatur mengenai teknologi blockchain dan aplikasinya dalam pendidikan. Analisis kebutuhan sistem dan perancangan arsitektur blockchain. Pengembangan prototype menggunakan Ethereum atau Hyperledger. Pengujian keamanan dan performa sistem.",
    mahasiswa: {
      nama: "Ahmad Rizki Pratama",
      nim: "2021001",
    },
    dosenPA: {
      nama: "Dr. Indah Hidayanti, M.Kom",
      nip: "198501012010122001",
    },
    referensi: [
      "Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System. Bitcoin.org.",
      "Zhang, P., & Schmidt, D. C. (2020). Blockchain Applications in Education: A Systematic Review. Computers & Education, 145, 103732.",
      "Grech, A., & Camilleri, A. F. (2017). Blockchain in Education. European Commission, JRC Science for Policy Report.",
      "Turkanović, M., et al. (2018). EduCTX: A Blockchain-based Higher Education Credit Platform. IEEE Access, 6, 5112-5127.",
    ],
  },
  {
    id: 2,
    judul:
      "Aplikasi Absensi Mahasiswa Berbasis QR Code dengan Integrasi Sistem Akademik",
    tanggalDiajukan: "2025-03-02",
    status: "pending",
    masalah:
      "Sistem absensi manual yang masih menggunakan tanda tangan fisik rawan kecurangan dan tidak efisien. Proses rekapitulasi absensi memakan waktu lama dan rentan human error. Tidak ada real-time monitoring untuk kehadiran mahasiswa.",
    solusi:
      "Mengembangkan aplikasi mobile berbasis QR Code untuk sistem absensi digital. Integrasi dengan sistem akademik existing untuk sinkronisasi data real-time. Implementasi GPS tracking untuk memastikan mahasiswa berada di lokasi kampus.",
    hasil:
      "Sistem absensi yang lebih cepat, transparan, dan akurat. Real-time monitoring kehadiran mahasiswa. Otomatisasi proses rekapitulasi absensi dan pelaporan.",
    kebutuhan:
      "Data mahasiswa, data jadwal kuliah, data ruang kelas, dan data dosen. API sistem akademik existing untuk integrasi data.",
    metode:
      "Analisis kebutuhan sistem absensi existing. Perancangan UI/UX aplikasi mobile. Pengembangan aplikasi menggunakan React Native dan backend API. Uji coba dan evaluasi sistem.",
    mahasiswa: {
      nama: "Siti Nurhaliza",
      nim: "2021015",
    },
    dosenPA: {
      nama: "Dr. Budi Santoso, M.T",
      nip: "197803152005011002",
    },
    referensi: [
      "Kumar, A., & Singh, K. (2019). QR Code Based Attendance Management System. International Journal of Computer Applications, 178(46), 20-24.",
      "Rahman, M. A., et al. (2020). Smart Attendance System Using QR Code and Mobile Application. Journal of Computer Science and Technology, 15(2), 45-52.",
      "Chen, W., & Li, Y. (2021). Mobile-based Student Attendance Tracking System: A Systematic Review. Educational Technology Research, 28(3), 112-128.",
    ],
  },
  {
    id: 3,
    judul:
      "Sistem Informasi Manajemen Perpustakaan Berbasis Web dengan Teknologi Cloud",
    tanggalDiajukan: "2025-03-03",
    tanggalDiverifikasi: "2025-03-07",
    status: "ditolak",
    masalah:
      "Pengelolaan buku dan koleksi perpustakaan masih manual dan tidak terintegrasi. Pencarian buku memakan waktu lama dan tidak efisien. Sistem peminjaman dan pengembalian belum terdigitalisasi.",
    solusi:
      "Membuat sistem informasi perpustakaan berbasis web dengan arsitektur cloud. Implementasi sistem katalog digital dengan fitur pencarian advanced. Integrasi dengan sistem notifikasi otomatis untuk reminder peminjaman.",
    hasil:
      "Pengelolaan perpustakaan yang lebih efisien dan terorganisir. Kemudahan akses katalog buku secara online. Otomatisasi proses peminjaman dan pengembalian buku.",
    kebutuhan:
      "Data buku, data anggota perpustakaan, data transaksi peminjaman. Infrastruktur cloud untuk hosting sistem.",
    metode:
      "Analisis sistem perpustakaan existing dan identifikasi kebutuhan. Perancangan database dan arsitektur sistem. Implementasi menggunakan framework web modern. Testing dan deployment ke cloud platform.",
    mahasiswa: {
      nama: "Rina Kurniasari",
      nim: "2021028",
    },
    dosenPA: {
      nama: "Dr. Siti Aminah, M.Kom",
      nip: "198209102008122003",
    },
    referensi: [
      "Johnson, L., & Smith, R. (2020). Digital Library Management Systems: A Comprehensive Guide. Library Technology Reports, 56(4), 15-28.",
      "Anderson, K., et al. (2019). Cloud-based Library Information Systems: Benefits and Challenges. Information Technology and Libraries, 38(2), 42-55.",
      "Williams, M. (2021). Modern Web Development for Library Systems. Journal of Library Software, 12(3), 78-92.",
    ],
  },
];

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

// Data Pengajuan Ujian untuk Admin
export const pengajuanUjianAdminData: PengajuanUjianAdmin[] = [
  {
    id: 1,
    nim: "230112233",
    nama: "Andi Wijaya",
    judulSkripsi: "Implementasi Blockchain untuk Sistem Akademik",
    jenisUjian: {
      id: 1,
      nama: "Seminar Proposal",
    },
    pembimbing1: {
      id: 1,
      nama: "Dr. Indah Hidayanti, M.Kom",
      nidn: "0501018501",
    },
    pembimbing2: {
      id: 2,
      nama: "Dr. Budi Santoso, M.T",
      nidn: "0515037803",
    },
    tanggalPengajuan: "2025-01-15",
    status: "pending" as const,
    prodi: {
      id: 1,
      nama: "Teknik Informatika",
    },
    semester: 7,
    ipk: 3.45,
    dokumenPendukung: {
      transkrip: "transkrip-230112233.pdf",
      krs: "krs-230112233.pdf",
      pernyataan: "pernyataan-230112233.pdf",
    },
  },
  {
    id: 2,
    nim: "230445566",
    nama: "Dewi Lestari",
    judulSkripsi:
      "Aplikasi Absensi Mahasiswa Berbasis QR Code dengan Integrasi Sistem Presensi Akademik",
    jenisUjian: {
      id: 2,
      nama: "Seminar Hasil",
    },
    pembimbing1: {
      id: 3,
      nama: "Dr. Siti Aminah, M.Kom",
      nidn: "0210098209",
    },
    pembimbing2: {
      id: 4,
      nama: "Dr. Andi Wijaya, M.T",
      nidn: "0120127512",
    },
    tanggalPengajuan: "2025-01-20",
    status: "approved" as const,
    prodi: {
      id: 1,
      nama: "Teknik Informatika",
    },
    semester: 8,
    ipk: 3.67,
    dokumenPendukung: {
      transkrip: "transkrip-230445566.pdf",
      krs: "krs-230445566.pdf",
      pernyataan: "pernyataan-230445566.pdf",
    },
  },
  {
    id: 3,
    nim: "230778899",
    nama: "Budi Santoso",
    judulSkripsi: "Sistem Informasi Manajemen Perpustakaan Berbasis Web",
    jenisUjian: {
      id: 3,
      nama: "Ujian Skripsi",
    },
    pembimbing1: {
      id: 5,
      nama: "Dr. Rina Kurnia, M.Kom",
      nidn: "0215068706",
    },
    pembimbing2: {
      id: 1,
      nama: "Dr. Indah Hidayanti, M.Kom",
      nidn: "0501018501",
    },
    tanggalPengajuan: "2025-01-25",
    status: "review" as const,
    prodi: {
      id: 1,
      nama: "Teknik Informatika",
    },
    semester: 8,
    ipk: 3.23,
    dokumenPendukung: {
      transkrip: "transkrip-230778899.pdf",
      krs: "krs-230778899.pdf",
      pernyataan: "pernyataan-230778899.pdf",
    },
  },
  {
    id: 4,
    nim: "230334455",
    nama: "Sari Indah",
    judulSkripsi: "Machine Learning untuk Prediksi Nilai Mahasiswa",
    jenisUjian: {
      id: 1,
      nama: "Seminar Proposal",
    },
    pembimbing1: {
      id: 2,
      nama: "Dr. Budi Santoso, M.T",
      nidn: "0515037803",
    },
    pembimbing2: {
      id: 4,
      nama: "Dr. Andi Wijaya, M.T",
      nidn: "0120127512",
    },
    tanggalPengajuan: "2025-01-30",
    status: "rejected" as const,
    prodi: {
      id: 1,
      nama: "Teknik Informatika",
    },
    semester: 7,
    ipk: 3.12,
    dokumenPendukung: {
      transkrip: "transkrip-230334455.pdf",
      krs: "krs-230334455.pdf",
      pernyataan: "pernyataan-230334455.pdf",
    },
    catatan: "Judul belum sesuai dengan fokus penelitian yang diinginkan",
  },
  {
    id: 5,
    nim: "230556677",
    nama: "Ahmad Rizky",
    judulSkripsi: "Sistem Keamanan IoT menggunakan Teknologi Blockchain",
    jenisUjian: {
      id: 2,
      nama: "Seminar Hasil",
    },
    pembimbing1: {
      id: 3,
      nama: "Dr. Siti Aminah, M.Kom",
      nidn: "0210098209",
    },
    pembimbing2: {
      id: 5,
      nama: "Dr. Rina Kurnia, M.Kom",
      nidn: "0215068706",
    },
    tanggalPengajuan: "2025-02-05",
    status: "pending" as const,
    prodi: {
      id: 1,
      nama: "Teknik Informatika",
    },
    semester: 8,
    ipk: 3.78,
    dokumenPendukung: {
      transkrip: "transkrip-230556677.pdf",
      krs: "krs-230556677.pdf",
      pernyataan: "pernyataan-230556677.pdf",
    },
  },
  {
    id: 6,
    nim: "230667788",
    nama: "Maya Sari",
    judulSkripsi:
      "Aplikasi E-Learning Berbasis Gamifikasi untuk Meningkatkan Motivasi Belajar",
    jenisUjian: {
      id: 1,
      nama: "Seminar Proposal",
    },
    pembimbing1: {
      id: 1,
      nama: "Dr. Indah Hidayanti, M.Kom",
      nidn: "0501018501",
    },
    pembimbing2: {
      id: 3,
      nama: "Dr. Siti Aminah, M.Kom",
      nidn: "0210098209",
    },
    tanggalPengajuan: "2025-02-08",
    status: "approved" as const,
    prodi: {
      id: 1,
      nama: "Teknik Informatika",
    },
    semester: 7,
    ipk: 3.89,
    dokumenPendukung: {
      transkrip: "transkrip-230667788.pdf",
      krs: "krs-230667788.pdf",
      pernyataan: "pernyataan-230667788.pdf",
    },
  },
];
