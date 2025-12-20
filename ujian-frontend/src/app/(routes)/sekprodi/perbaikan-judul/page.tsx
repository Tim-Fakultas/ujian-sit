import { getCurrentUserAction } from "@/actions/auth";
import { Suspense } from "react";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";
import PerbaikanJudulTable from "./PerbaikanJudulTable";
import { getPerbaikanJudulByProdi } from "@/actions/perbaikanJudul";
import { PerbaikanJudul } from "@/types/PerbaikanJudul";

export default async function Page() {
  const { user } = await getCurrentUserAction();


  const getPerbaikanJudulList: PerbaikanJudul[] = await getPerbaikanJudulByProdi(user?.prodi?.id || 0);
  return (
    <div className="p-6">
      <PageHeader
        title="Perbaikan Judul Skripsi"
        description="Daftar perbaikan judul skripsi program studi Anda."
        icon={FileText}
        variant="emerald"
        className="mb-6"
      />

      <Suspense fallback={<Loading />}>
        <PerbaikanJudulTable perbaikanJudulList={getPerbaikanJudulList} />
      </Suspense>
    </div>
  );
}
