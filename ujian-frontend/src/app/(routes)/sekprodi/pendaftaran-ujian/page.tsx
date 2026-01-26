import {
  getPendaftaranUjianByProdi,
} from "@/actions/pendaftaranUjian";
import PendaftaranUjianTable from "@/components/sekprodi/pendaftaran-ujian/PendaftaranTable";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/auth";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";


export default async function PendaftaranUjianPage() {
  const { user } = await getCurrentUserAction();


  const pendaftaranUjianList = await getPendaftaranUjianByProdi(
    user?.prodi?.id || 0
  );




  return (
    <div className="p-6">
      <PageHeader
        title="Pendaftaran Ujian"
        description="Kelola pendaftaran ujian mahasiswa di sini."
        iconName="FileText"
        variant="emerald"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <PendaftaranUjianTable
          pendaftaranUjianList={pendaftaranUjianList}
        />
      </Suspense>
    </div>
  );
}
