export interface Rancangan {
  id: number;
  judul: string;
  tanggalDiajukan: string;
  tanggalDiverifikasi?: string;
  status: "pending" | "disetujui" | "ditolak";
  masalah: string;
  solusi: string;
  hasil: string;
  kebutuhan: string;
  metode: string;
}
