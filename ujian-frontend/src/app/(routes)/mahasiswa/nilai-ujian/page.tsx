import {  getBeritaUjianByMahasiswa } from "@/actions/beritaUjian";
import { getCurrentUserAction } from "@/actions/auth";
import { Suspense } from "react";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";
import NilaiUjianTable from "@/components/mahasiswa/nilai-ujian/NilaiUjianTable";
// Force rebuild

export default async function RekapitulasiNilaiPage() {
  const { user } = await getCurrentUserAction();
  const ujian = await getBeritaUjianByMahasiswa(user?.id);
  return (
    <div className="p-6">
      <PageHeader
        title="Nilai Ujian"
        description="Lihat nilai ujian anda di sini."
        icon={FileText}
        variant="blue"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <NilaiUjianTable ujian={ujian} />
      </Suspense>
    </div>
  );
}
