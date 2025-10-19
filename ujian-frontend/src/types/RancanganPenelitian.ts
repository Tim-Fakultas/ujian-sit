export interface RancanganPenelitian {
  id?: number;
  judulPenelitian: string;
  masalahDanPenyebab: string;
  alternatifSolusi: string;
  metodePenelitian: string;
  hasilYangDiharapkan: string;
  kebutuhanData: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface PengajuanRanpel {
  id: number;
  mahasiswa: {
    id: number;
    nama: string;
    nim: string;
    noHp: string;
    alamat: string;
    semester: number;
    ipk: number;
    status: string;
    angkatan: string;
    userId: number;
    prodi: {
      id: number;
      nama: string;
    };
    peminatan: {
      id: number;
      nama: string;
    };
    dosenPa: {
      id: number;
      nip: string;
      nidn: string;
      nama: string;
    };
    pembimbing1?: {
      id: number;
      nama: string
    }
    pembimbing2?: {
      id: number;
      nama: string
    }
    user: {
      id: number;
      name?: string | null;
    };
    createdAt: string;
    updatedAt: string;
  };
  ranpel: RancanganPenelitian;
  tanggalPengajuan: string;
  tanggalDiterima?: string | null;
  keterangan?: string | null;
  status: "menunggu" | "diverifikasi" | "diterima" | "ditolak";
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface PengajuanRanpelResponse {
  data: PengajuanRanpel[];
}
