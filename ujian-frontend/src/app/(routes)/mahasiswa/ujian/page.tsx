import { getCurrentUserAction } from "@/actions/auth";
import { Suspense } from "react";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import NilaiUjianTable from "@/components/mahasiswa/nilai-ujian/NilaiUjianTable";
import { getUjianByMahasiswa } from "@/actions/beritaUjian";

export default async function RekapitulasiNilaiPage() {
  const { user } = await getCurrentUserAction();
  const ujian = await getUjianByMahasiswa(user?.id);
  return (
    <div className="p-6">
      <PageHeader
        title="Ujian"
        description="Lihat ujian dan penilaian."
        iconName="FileText"
        variant="blue"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <NilaiUjianTable ujian={ujian} />
      </Suspense>
    </div>
  );
}
