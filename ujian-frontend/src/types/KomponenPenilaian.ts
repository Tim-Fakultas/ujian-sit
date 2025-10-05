export interface KomponenPenilaian {
  id: number;
  jenisUjianId: number;
  jenisUjian: {
    id: number;
    namaJenis: string;
  };
  namaKomponen: string;
  bobot: number;
  createdAt?: string;
  updatedAt?: string;
}
