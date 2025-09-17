import { TablePengajuan } from "@/components/table-pengajuan";

export default function MahasiswaPage() {
  return (
    <div className="container mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Sistem E-Skripsi</h1>
        <p className="text-muted-foreground mt-2">Kelola pengajuan skripsi mahasiswa dengan mudah</p>
      </div>
      <TablePengajuan/>
    </div>
  );
}
