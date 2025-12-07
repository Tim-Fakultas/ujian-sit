import { Dosen } from "./Dosen";

export interface PenilaianItem {
  dosenId?: number;
  dosen: Dosen;
  jabatan: string;
  total: number;
  komponenPenilaian?: { bobot?: number };
  nilai?: number;
}