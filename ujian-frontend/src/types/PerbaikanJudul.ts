import { Mahasiswa } from "./Mahasiswa";
import { RancanganPenelitian } from "./RancanganPenelitian";

export interface PerbaikanJudul {
    id: number;
    ranpel: RancanganPenelitian;
    mahasiswa: Mahasiswa;
    judulLama: string;
    judulBaru: string;
    berkas: string;
    status: string;
    tanggalPerbaikan: string;
    tanggalDiterima: string;   
}

export interface PerbaikanJudulResponse {
    data: PerbaikanJudul[];
}