import { getBeritaUjian } from "@/actions/beritaUjian";
import { getHadirUjian } from "@/actions/daftarHadirUjian";
import { getLoggedInUser } from "@/actions/pendaftaranUjian";
import BeritaAcaraUjianTable from "@/components/sekprodi/pendaftaran-ujian/beritaAcaraTable";
import { BeritaUjian } from "@/types/beritaUjian";
import { Suspense } from "react";
import Loading from "./loading";

export default async function BeritaUjianPage() {
  const loggedInUser = await getLoggedInUser();
  const beritaUjian: BeritaUjian[] = await getBeritaUjian(
    loggedInUser?.prodi.id
  );

  const daftarKehadiran = await getHadirUjian();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Berita Ujian</h1>
      <Suspense fallback={<Loading />}>
        <BeritaAcaraUjianTable
          beritaUjian={beritaUjian}
          daftarKehadiran={daftarKehadiran}
        />
      </Suspense>
    </div>
  );
}
