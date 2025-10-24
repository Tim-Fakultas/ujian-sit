import { getCurrentUserAction } from "@/actions/loginAction";
import PengajuanTable from "@/components/dosen/PengajuanTable";
import { Suspense } from "react";
import Loading from "./loading";

export default async function Page() {
  const { user } = await getCurrentUserAction();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Rancangan Penelitian</h1>
      <Suspense fallback={<Loading />}>
        <PengajuanTable userId={user?.id} />
      </Suspense>
    </div>
  );
}
