import { getBeritaUjian } from "@/actions/beritaUjian";
import { getLoggedInUser } from "@/actions/pendaftaranUjian";
import BeritaAcaraUjianTable from "@/components/sekprodi/pendaftaran-ujian/beritaAcaraTable";
import { UjianResponse } from "@/types/Ujian";

export default async function BeritaUjianPage() {
  const loggedInUser = await getLoggedInUser();
  const rawBeritaUjian = await getBeritaUjian(loggedInUser?.prodi.id);
  const beritaUjian: UjianResponse = Array.isArray(rawBeritaUjian)
    ? { data: rawBeritaUjian }
    : rawBeritaUjian;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Berita Ujian</h1>
      <BeritaAcaraUjianTable beritaUjian={beritaUjian} />
    </div>
  );
}
