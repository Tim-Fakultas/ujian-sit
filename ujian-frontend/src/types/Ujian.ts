// ======================================
// 🧩 Interface Struktur Data Ujian
// ======================================

export interface Prodi {
  id: number;
  namaProdi: string;
}

export interface Mahasiswa {
  id: number;
  nama: string;
  nim: string;
  prodi: Prodi;
  pembimbing1: number | null;
  pembimbing2: number | null;
}

export interface JenisUjian {
  id: number;
  namaJenis: string;
}

export interface PendaftaranUjian {
  id: number;
  status: "menunggu" | "dijadwalkan" | "selesai";
}

export interface Ujian {
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
  ketuaPenguji: {
    id: number;
    nama: string;
  }
  peranPenguji?: string | null;
  sekretarisPenguji: {
    id: number;
    nama: string;
  }
  penguji1: {
    id: number;
    nama: string;
  }
  penguji2: {
    id: number;
    nama: string;
  }
  hasil: string | null;
  nilaiAkhir: number | null;
  catatan: string | null;
}

export interface UjianResponse {
  data: Ujian[];
}
