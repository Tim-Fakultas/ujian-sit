import { getCurrentUserAction } from "@/actions/loginAction";
import { getPendaftaranUjianByProdi } from "@/actions/pendaftaranUjian";
import PendaftaranUjianTable from "@/components/admin/PendaftaranUjianTable";
import { Suspense } from "react";
import Loading from "./loading";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";

export default async function PendaftaranUjianPage() {
  const { user } = await getCurrentUserAction();
  const pendaftaranUjian: PendaftaranUjian[] = await getPendaftaranUjianByProdi(
    user?.prodi?.id || 0
  );
  return (
    <div className="p-6">
      <Suspense fallback={<Loading />}>
        <PendaftaranUjianTable pendaftaranUjian={pendaftaranUjian} />
      </Suspense>
    </div>
  );
}
