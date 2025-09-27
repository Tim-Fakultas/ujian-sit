export interface Bimbingan {
  id: number;
  jenis: "Proposal" | "Skripsi";
  judul: string;
  dospem1: string;
  dospem2: string;
  status: "menunggu" | "diterima" | "ditolak";
  tanggal: string;
}