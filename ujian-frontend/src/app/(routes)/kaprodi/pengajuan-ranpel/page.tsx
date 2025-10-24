import { getCurrentUserAction } from "@/actions/loginAction";
import PengajuanTable from "@/components/kaprodi/PengajuanTable";
import { Suspense } from "react";
import Loading from "./loading";

export default async function Page() {
  const { user } = await getCurrentUserAction();

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-bold">Rancangan Penelitian</h1>
        <p>Lihat semua pengajuan rancangan penelitian di program studi Anda</p>
      </div>
      <Suspense fallback={<Loading />}>
        <PengajuanTable prodiId={user?.prodi?.id} />
      </Suspense>
    </div>
  );
}
