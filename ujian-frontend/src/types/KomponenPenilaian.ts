export interface JenisUjian {
  id: number;
  namaJenis: string;
}

export interface KomponenPenilaian {
  id: number;
  jenisUjianId: number;
  jenisUjian: JenisUjian;
  namaKomponen: string;
  bobot: number;
  createdAt: string;
  updatedAt: string;
}

export interface KomponenPenilaianResponse {
  data: KomponenPenilaian[];
}
