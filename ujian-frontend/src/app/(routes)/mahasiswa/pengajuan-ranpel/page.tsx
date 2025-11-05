import PengajuanTable from "@/components/mahasiswa/pengajuan-ranpel/PengajuanTable";

import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/loginAction";

export default async function Page() {
  const { user } = await getCurrentUserAction();

  return (
    <div className="p-6 flex flex-col gap-6">
      <Suspense fallback={<Loading />}>
        <PengajuanTable userId={user?.id} />
      </Suspense>
    </div>
  );
}
