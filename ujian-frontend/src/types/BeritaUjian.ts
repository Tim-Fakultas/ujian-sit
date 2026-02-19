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
  status: "menunggu" | "diterima" | "dijadwalkan" | "selesai" | "revisi";
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
  ruangan: {
    id: number;
    namaRuangan: string;
  };
  penguji: {
    id: number;
    nama: string;
    peran: "ketua_penguji" | "sekretaris_penguji" | "penguji_1" | "penguji_2";
  }[];

  hasil: string | null;
  nilaiAkhir: number | null;
  keputusan: {
    id: number;
    kode: string;
    namaKeputusan: string;
  };
  catatan: string | null;
}

export interface BeritaUjianResponse {
  data: BeritaUjian[];
}
