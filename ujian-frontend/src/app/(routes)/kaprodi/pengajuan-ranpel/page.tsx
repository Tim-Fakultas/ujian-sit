import { getCurrentUserAction } from "@/actions/auth";
import PengajuanTable from "@/components/kaprodi/PengajuanTable";
import { Suspense } from "react";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";

export default async function Page() {
  
  const { user } = await getCurrentUserAction();

  return (
    <div className="p-6">
      <PageHeader 
        title="Pengajuan Rancangan Penelitian"
        description="Daftar pengajuan rancangan penelitian program studi Anda."
        iconName="FileText"
        variant="emerald"
        className="mb-6"
      />

      <Suspense fallback={<Loading />}>
        <PengajuanTable prodiId={user?.prodi?.id} />
      </Suspense>
    </div>
  );
}
