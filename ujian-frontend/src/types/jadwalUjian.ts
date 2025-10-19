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

  penguji_1: {
    id: number;
    nama: string;
  };

  penguji_2: {
    id: number;
    nama: string;
  };

  ruangan: {
    id: number;
    nama: string;
  };

  ketua_penguji: {
    id: number;
    nama: string;
  };

  sekretaris_penguji: {
    id: number;
    nama: string;
  };

  tanggal: string;
  hari: string;
  status: "dijadwalkan" | "sedang_berlangsung" | "selesai";
  waktu_mulai: string;
  waktu_selesai: string;
}
