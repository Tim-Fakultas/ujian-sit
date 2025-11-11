import { getCurrentUserAction } from "@/actions/auth";
import PengajuanTable from "@/components/dosen/PengajuanTable";
import { Suspense } from "react";
import Loading from "./loading";

export default async function Page() {
  const { user } = await getCurrentUserAction();

  return (
    <div className="p-6">
      <Suspense fallback={<Loading />}>
        <PengajuanTable userId={user?.id} />
      </Suspense>
    </div>
  );
}
