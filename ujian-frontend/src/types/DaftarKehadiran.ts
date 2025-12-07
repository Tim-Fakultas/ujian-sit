export interface daftarKehadiran {
  id: number;
  ujianId: number;
  dosenId: number;
  statusKehadiran: "hadir" | "izin" | "tidak_hadir";
  keterangan: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HadirUjian {
  id: number;
  ujianId: number;
  dosenId: number;
  statusKehadiran: string;
}
