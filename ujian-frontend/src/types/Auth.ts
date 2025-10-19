export interface AuthResponse {
  message: string;
  success: boolean;
  role: string;
  roles: string[];
  permissions: string[];
  user: MahasiswaUser;
  access_token: string;
  token_type: string;
}

export interface MahasiswaUser {
  id: number;
  user_id: number;
  nim: string;
  nama: string;
  email: string;
  no_hp: string;
  alamat: string;
  semester: number;
  ipk: number;
  prodi: Prodi;
  peminatan: Peminatan;
  dosen_pa: DosenPA;
  pembimbing1: {
    id: number;
    nama: string;
  } | null;
  pembimbing2: {
    id: number;
    nama: string;
  } | null;
}

export interface Prodi {
  id: number;
  nama_prodi: string;
  fakultas_id: number;
  created_at: string;
  updated_at: string;
}

export interface Peminatan {
  id: number;
  nama_peminatan: string;
  prodi_id: number;
  created_at: string;
  updated_at: string;
}

export interface DosenPA {
  id: number;
  nama: string;
}

export interface AuthDosenResponse {
  message: string;
  success: boolean;
  role: string;
  roles: string[];
  permissions: string[];
  user: DosenUser;
  access_token: string;
  token_type: string;
}

export interface DosenUser {
  id: number;
  nip_nim: string;
  nama: string;
  email: string;
  prodi: Prodi;
}
