import PengajuanTable from "@/components/mahasiswa/pengajuan-ranpel/PengajuanTable";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/auth";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";

export default async function Page() {
  const { user } = await getCurrentUserAction();

  return (
    <div className="p-6 flex flex-col">
      
      <PageHeader
        title="Pengajuan Rancangan Penelitian"
        description="Kelola pengajuan rancangan penelitian Anda di sini."
        icon={FileText}
        variant="blue"
        className="mb-6"
      />

      <Suspense fallback={<Loading />}>
        <PengajuanTable userId={user?.id} />
      </Suspense>
    </div>
  );
}
