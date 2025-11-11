import { getBeritaUjian } from "@/actions/beritaUjian";
import { getHadirUjian } from "@/actions/daftarHadirUjian";
import BeritaAcaraUjianTable from "@/components/sekprodi/pendaftaran-ujian/beritaAcaraTable";
import { BeritaUjian } from "@/types/BeritaUjian";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/auth";

export default async function BeritaUjianPage() {
  const { user } = await getCurrentUserAction();
  const beritaUjian: BeritaUjian[] = await getBeritaUjian(user?.prodi?.id);

  const daftarKehadiran = await getHadirUjian();

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-semibold mb-4">Berita Ujian</h1> */}
      <Suspense fallback={<Loading />}>
        <BeritaAcaraUjianTable
          beritaUjian={beritaUjian}
          daftarKehadiran={daftarKehadiran}
        />
      </Suspense>
    </div>
  );
}
