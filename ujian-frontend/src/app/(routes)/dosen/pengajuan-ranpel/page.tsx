import { getCurrentUserAction } from "@/actions/auth";
import PengajuanTable from "@/app/(routes)/dosen/pengajuan-ranpel/PengajuanTable";
import { Suspense } from "react";
import Loading from "./loading";

import Header from "@/components/Header";

export default async function Page() {
  const { user } = await getCurrentUserAction();

  return (
    <div className="p-6">
      <Header
        title="Pengajuan Rancangan Penelitian"
        desc="Daftar pengajuan rancangan penelitian mahasiswa anda."
      />
      <Suspense fallback={<Loading />}>
        <PengajuanTable userId={user?.id} />
      </Suspense>
    </div>
  );
}
