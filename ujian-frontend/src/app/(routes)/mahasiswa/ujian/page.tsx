import {  getBeritaUjianByMahasiswa } from "@/actions/beritaUjian";
import { getCurrentUserAction } from "@/actions/auth";
import { Suspense } from "react";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import NilaiUjianTable from "@/components/mahasiswa/nilai-ujian/NilaiUjianTable";

export default async function RekapitulasiNilaiPage() {
  const { user } = await getCurrentUserAction();
  const ujian = await getBeritaUjianByMahasiswa(user?.id);
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
