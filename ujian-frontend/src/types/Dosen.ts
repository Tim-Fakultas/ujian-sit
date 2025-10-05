export interface Dosen {
  id: number;
  nidn: string;
  nama: string;
  noHp: string;
  alamat: string;
  prodi: {
    id: number;
    nama: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
