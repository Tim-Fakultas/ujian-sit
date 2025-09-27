export interface Ujian {
  id: number;
  nim: string;
  nama: string;
  waktu: string;
  ruang: string;
  judul: string;
  ketuaPenguji: string;
  sekretarisPenguji: string;
  penguji1: string;
  penguji2: string;
  jenis: "Seminar Proposal" | "Seminar Hasil" | "Seminar Skripsi";
  nilai?: string;
  status: "pending" | "dijadwalkan" | "selesai";
}