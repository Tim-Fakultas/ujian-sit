interface Ruangan {
  id: number;
  namaRuangan: string;
  prodiId: number;
  createdAt: string;
  updatedAt: string;
}

export interface RuanganResponse {
  data: Ruangan[];
}
