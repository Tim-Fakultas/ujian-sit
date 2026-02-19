// src/types/PendaftaranUjian.ts

export interface PendaftaranUjian {
  id: number;
  mahasiswa: {
    id: number;
    nama: string;
    nim: string;
    prodiId: {
      id: number;
      namaProdi: string;
    };
  };
  judulPenelitian: string;
  jenisUjian: {
    id: number;
    namaJenis: string;
  };
  tanggalPengajuan: string;
  tanggalDisetujui?: string | null;
  status: "menunggu" | "diverifikasi" | "diterima" | "revisi" | string;
  berkas: {
    id?: number;
    namaBerkas?: string;
    filePath: string;
    uploadedAt?: string;
    createdAt?: string;
    updatedAt?: string;
  }[];
  keterangan?: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface PendaftaranUjianResponse {
  data: Array<{
    id: number;
    mahasiswa: {
      id: number;
      nama: string;
      nim: string;
      prodiId: {
        id: number;
        namaProdi: string;
      };
    };
    judulPenelitian: string
    jenisUjian: {
      id: number;
      namaJenis: string;
    };
    tanggalPengajuan: string;
    tanggalDisetujui: string;
    status: string;
    berkas: {
      id?: number;
      namaBerkas?: string;
      filePath: string;
      uploadedAt?: string;
      createdAt?: string;
      updatedAt?: string;
    }[];
    keterangan: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
