export interface RancanganPenelitian {
  id: number;
  mahasiswa?: {
    id: number;
    nim: string;
    nama: string;
  },
  judul_penelitian: string;
  masalah_dan_penyebab: string;
  alternatif_solusi: string;
  metode_penelitian: string;
  hasil_yang_diharapkan: string;
  kebutuhan_data: string;
  status: "menunggu" | "diverifikasi" | "diterima" | "ditolak";
  keterangan?: string;
  tanggalPengajuan: string;
  tanggalDiterima?: string;
}
