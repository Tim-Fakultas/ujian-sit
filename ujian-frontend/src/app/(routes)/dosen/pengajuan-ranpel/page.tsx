import { getCurrentUserAction } from "@/actions/auth";
import { getPengajuanRanpelByDosenPA } from "@/actions/pengajuanRanpel";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import PengajuanRanpelTable from "@/components/dosen/pengajuan-ranpel/PengajuanRanpelTable";
import { Suspense } from "react";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";

export default async function Page() {
  const { user } = await getCurrentUserAction();
  const pengajuanRanpel: PengajuanRanpel[] = await getPengajuanRanpelByDosenPA(
    user?.id,
  );

  return (
    <div className="p-6">
      <PageHeader
        title="Pengajuan Rancangan Penelitian"
        description="Daftar pengajuan rancangan penelitian mahasiswa anda."
        iconName="FileText"
        variant="blue"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <PengajuanRanpelTable data={pengajuanRanpel} />
      </Suspense>
    </div>
  );
}
