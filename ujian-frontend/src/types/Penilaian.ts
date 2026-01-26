import { Dosen } from "./Dosen";

export interface AssessmentDetail {
  id?: number;
  komponen: string;
  bobot: number;
  nilai: number;
}

export interface PenilaianItem {
  dosenId?: number;
  dosen: Dosen;
  jabatan: string;
  total: number;
  komponenPenilaian?: { bobot?: number };
  nilai?: number;
  details?: AssessmentDetail[];
}