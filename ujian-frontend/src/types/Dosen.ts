export interface Prodi {
  id: number;
  nama: string;
}

export interface User {
  id: number;
  name: string | null;
}

export interface Dosen {
  id: number;
  nidn: string;
  nip: string | null;
  nama: string;
  noHp: string | null;
  alamat: string | null;
  tempatTanggalLahir: string | null;
  pangkat: string | null;
  golongan: string | null;
  tmtFst: string | null;
  jabatan: string | null;
  foto: string | null;
  userId: number;
  prodi: Prodi;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface DosenResponse {
  data: Dosen[];
}
