export interface JadwalUjian {
  id: number;

  mahasiswa: {
    id: number;
    nama: string;
    nim: string;
  };

  rancangan_penelitian: {
    id: number;
    judul: string;
  };

  jenis_ujian: {
    id: number;
    nama: string;
  };

  penguji_1?: {
    id: number;
    nama: string;
  } | null;

  penguji_2?: {
    id: number;
    nama: string;
  } | null;

  ruangan?: string | null;

  ketua_penguji?: {
    id: number;
    nama: string;
  } | null;

  sekretaris_penguji?: {
    id: number;
    nama: string;
  } | null;

  tanggal?: string | null;
  hari?: string | null;
  status: "dijadwalkan" | "sedang_berlangsung" | "selesai";
  waktu_mulai?: string | null;
  waktu_selesai?: string | null;
}
