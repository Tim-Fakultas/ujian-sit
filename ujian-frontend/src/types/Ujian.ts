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
  jenisUjianId: number;
  tanggalPengajuan: string;
  tanggalDisetujui: string | null;
  status: "menunggu" | "diterima" | "dijadwalkan" | "selesai";
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
  ruangan: {
    id: number;
    namaRuangan: string;
  };
  penguji: {
    id: number;
    nama: string;
    nip: string;
    nidn: string;
    peran: "ketua_penguji" | "sekretaris_penguji" | "penguji_1" | "penguji_2";
  }[];
  hasil: string | null;
  nilaiAkhir: number | null;
  catatan: string | null;
}

export interface UjianResponse {
  data: Ujian[];
}
