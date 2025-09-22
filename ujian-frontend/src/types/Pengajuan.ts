export interface Pengajuan {
  id: number;
  mahasiswa?: {
    id: number;
    nama: string;
    nim: string;
  };
  judul_skripsi: string;
  keterangan: string;
  tanggal_pengajuan: string;
  tanggal_disetujui: string | null;
  status: "pending" | "ditolak" | "disetujui" ;
}