import { getBeritaUjian } from "@/actions/beritaUjian";
import { getHadirUjian } from "@/actions/daftarHadirUjian";
import BeritaAcaraUjianTable from "@/components/sekprodi/pendaftaran-ujian/beritaAcaraTable";
import { BeritaUjian } from "@/types/BeritaUjian";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/auth";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";

export default async function BeritaUjianPage() {
  const { user } = await getCurrentUserAction();
  const beritaUjian: BeritaUjian[] = await getBeritaUjian(user?.prodi?.id);

  const daftarKehadiran = await getHadirUjian();

  return (
    <div className="p-6">
      <PageHeader
        title="Berita Acara Ujian"
        description="Lihat berita acara ujian di sini."
        iconName="FileText"
        variant="emerald"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <BeritaAcaraUjianTable
          beritaUjian={beritaUjian}
          daftarKehadiran={daftarKehadiran}
        />
      </Suspense>
    </div>
  );
}
