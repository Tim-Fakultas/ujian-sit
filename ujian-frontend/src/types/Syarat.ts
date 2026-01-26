export interface JenisUjian {
    id: number;
    namaJenis: string;
}

export interface Syarat {
    id: number;
    jenisUjianId: number;
    jenisUjian: JenisUjian;
    namaSyarat: string;
    kategori: 'akademik' | 'administratif' | 'bimbingan';
    deskripsi: string | null;
    wajib: boolean;
    createdAt: string;
    updatedAt: string;
}
