export interface PengajuanUjian {
  id: number;
  mahasiswa: {
    id: number;
    nim: string;
    nama: string;
    prodi: {
      id: number;
      nama: string;
    };
  };
  judulSkripsi: string;
  deskripsi: string;
  tanggalPengajuan: string;
  status: "pending" | "approved" | "rejected";
  pembimbing1?: {
    id: number;
    nama: string;
    nidn: string;
  };
  pembimbing2?: {
    id: number;
    nama: string;
    nidn: string;
  };
  skPembimbing?: string;
  catatan?: string;
}
