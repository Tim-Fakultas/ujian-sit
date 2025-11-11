// ======================================
// 🧩 Interface Detail Ujian dengan Relasi Lengkap
// ======================================

export interface Prodi {
  id: number;
  namaProdi: string;
}

export interface Dosen {
  id: number;
  nama: string;
  nip: string;
  nidn: string;
}

export interface Mahasiswa {
  id: number;
  nama: string;
  nim: string;
  prodi: Prodi;
  pembimbing1: Dosen | null;
  pembimbing2: Dosen | null;
}

export interface JenisUjian {
  id: number;
  namaJenis: string;
}

export interface PendaftaranUjian {
  id: number;
  tanggalPengajuan: string;
  tanggalDisetujui: string | null;
  status: "menunggu" | "diterima" | "dijadwalkan" | "selesai";
}

export interface BeritaUjian {
  id: number;
  pendaftaranUjian: PendaftaranUjian;
  judulPenelitian: string;
  mahasiswa: Mahasiswa;
  jenisUjian: JenisUjian;
  hariUjian: string | null;
  jadwalUjian: string;
  waktuMulai: string;
  waktuSelesai: string;
  ruangan: string;
  ketuaPenguji: Dosen;
  sekretarisPenguji: Dosen;
  penguji1: Dosen;
  penguji2: Dosen;
  hasil: string | null;
  nilaiAkhir: number | null;
  keputusan: string | null;
  catatan: string | null;
}

export interface BeritaUjianResponse {
  data: BeritaUjian[];
}
