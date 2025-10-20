import { getBeritaUjian } from "@/actions/beritaUjian";
import { getLoggedInUser } from "@/actions/pendaftaranUjian";
import BeritaAcaraUjianTable from "@/components/sekprodi/pendaftaran-ujian/beritaAcaraTable";
import { BeritaUjian } from "@/types/beritaUjian";

export default async function BeritaUjianPage() {
  const loggedInUser = await getLoggedInUser();
  const beritaUjian: BeritaUjian[] = await getBeritaUjian(
    loggedInUser?.prodi.id
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Berita Ujian</h1>
      <BeritaAcaraUjianTable beritaUjian={beritaUjian} />
    </div>
  );
}
