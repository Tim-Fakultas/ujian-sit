import { getCurrentUserAction } from "@/actions/loginAction";
import { getPendaftaranUjianByProdi } from "@/actions/pendaftaranUjian";
import PendaftaranUjianTable from "@/components/admin/PendaftaranUjianTable";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import { Suspense } from "react";
import Loading from "./loading";

export default async function PendaftaranUjianPage() {
  const { user } = await getCurrentUserAction();
  const pendaftaranUjian: PendaftaranUjian[] = await getPendaftaranUjianByProdi(
    user?.prodi.id
  );
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pendaftaran Ujian</h1>
      <Suspense fallback={<Loading />}>
        <PendaftaranUjianTable
          pendaftaranUjian={pendaftaranUjian}
          user={user}
        />
      </Suspense>
    </div>
  );
}
