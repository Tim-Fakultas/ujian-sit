export interface ProdiId {
  id: number;
  namaProdi: string;
}

export interface Mahasiswa {
  id: number;
  nama: string;
  nim: string;
  prodiId: ProdiId;
}

export interface Ranpel {
  id: number;
  judulPenelitian: string;
}

export interface JenisUjian {
  id: number;
  namaJenis: string;
}

export interface PendaftaranUjian {
  id: number;
  mahasiswa: Mahasiswa;
  ranpel: Ranpel;
  jenisUjian: JenisUjian;
  tanggalPengajuan: string;
  tanggalDisetujui: string;
  status: string;
  berkas: any[];
  keterangan: string;
}

export interface PendaftaranUjianResponse {
  data: PendaftaranUjian[];
}
