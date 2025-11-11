import { getCurrentUserAction } from "@/actions/auth";
import PengajuanTable from "@/components/kaprodi/PengajuanTable";
import { Suspense } from "react";
import Loading from "./loading";

export default async function Page() {
  const { user } = await getCurrentUserAction();

  return (
    <div className="p-6">
      <Suspense fallback={<Loading />}>
        <PengajuanTable prodiId={user?.prodi?.id} />
      </Suspense>
    </div>
  );
}
