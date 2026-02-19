// export interface AuthResponse {
//   message: string;
//   success: boolean;
//   role: string;
//   roles: string[];
//   permissions: string[];
//   user: MahasiswaUser;
//   access_token: string;
//   token_type: string;
// }

// export interface MahasiswaUser {
//   id: number;
//   user_id: number;
//   nim: string;
//   nama: string;
//   email: string;
//   no_hp: string;
//   alamat: string;
//   semester: number;
//   ipk: number;
//   prodi: Prodi;
//   peminatan: Peminatan;
//   dosen_pa: DosenPA;
//   pembimbing1: {
//     id: number;
//     nama: string;
//   } | null;
//   pembimbing2: {
//     id: number;
//     nama: string;
//   } | null;
// }

// export interface Prodi {
//   id: number;
//   nama_prodi: string;
//   fakultas_id: number;
//   created_at: string;
//   updated_at: string;
// }

// export interface Peminatan {
//   id: number;
//   nama_peminatan: string;
//   prodi_id: number;
//   created_at: string;
//   updated_at: string;
// }

// export interface DosenPA {
//   id: number;
//   nama: string;
// }

// export interface AuthDosenResponse {
//   message: string;
//   success: boolean;
//   role: string;
//   roles: string[];
//   permissions: string[];
//   user: DosenUser;
//   access_token: string;
//   token_type: string;
// }

// export interface DosenUser {
//   id: number;
//   nip_nim: string;
//   nama: string;
//   email: string;
//   prodi: Prodi;
// }

// src/types/auth.ts

export interface Prodi {
  id: number;
  nama: string;
  nama_prodi?: string;
  namaProdi?: string;
  fakultas_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Peminatan {
  id: number;
  nama_peminatan: string;
  prodi_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Dosen {
  id: number;
  nama: string;
}

export interface Role {
  id?: number;
  name: string;
  guard_name?: string;
}

export interface User {
  id: number;
  user_id?: number; // kadang backend kirim ini untuk relasi ke tabel users
  nim?: string; // khusus mahasiswa
  nip_nim?: string; // untuk dosen/admin
  nidn?: string; // khusus dosen
  nip?: string; // khusus dosen
  nama: string;
  email: string;
  no_hp?: string;
  alamat?: string;
  tempat_tanggal_lahir?: string;
  pangkat?: string;
  golongan?: string;
  jabatan?: string;
  tmt_fst?: string;
  semester?: number;
  ipk?: number;
  status?: string; // contoh: "aktif"
  angkatan?: string;
  foto?: string | null;
  fakultas?: string;
  roles?: Role[]; // role dari sistem permission (Spatie-style)
  role?: string; // role tunggal dari backend
  prodi?: Prodi;
  peminatan?: {
    id: number;
    nama: string;
  };
  dosen_pa?: Dosen;
  pembimbing1?: Dosen;
  pembimbing2?: Dosen;
  is_default_password?: boolean;
  url_ktm?: string;
  url_transkrip_nilai?: string;
  url_bukti_lulus_metopen?: string;
  url_sertifikat_bta?: string;
  url_ttd?: string;
}
