export interface PengajuanUjianAdmin {
  id: number;
  nim: string;
  nama: string;
  judulSkripsi: string;
  jenisUjian: {
    id: number;
    nama: string;
  };
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
  tanggalPengajuan: string;
  status: "pending" | "approved" | "rejected" | "review";
  prodi: {
    id: number;
    nama: string;
  };
  semester: number;
  ipk: number;
  dokumenPendukung?: {
    transkrip?: string;
    krs?: string;
    pernyataan?: string;
  };
  catatan?: string;
}
