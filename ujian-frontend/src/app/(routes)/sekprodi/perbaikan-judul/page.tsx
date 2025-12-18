import { getCurrentUserAction } from "@/actions/auth";
import { Suspense } from "react";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";
import PerbaikanJudulTable from "./PerbaikanJudulTable";

export default async function Page() {
  const { user } = await getCurrentUserAction();

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
        <PerbaikanJudulTable prodiId={user?.prodi?.id} />
      </Suspense>
    </div>
  );
}
