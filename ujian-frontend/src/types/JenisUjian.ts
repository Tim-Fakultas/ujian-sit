export interface JenisUjian {
  id: number;
  namaJenis: string;
  deskripsi: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface JenisUjianResponse {
  data: JenisUjian[];
}
