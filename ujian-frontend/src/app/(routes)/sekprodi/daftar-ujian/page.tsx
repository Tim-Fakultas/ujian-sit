import { getDosen } from "@/actions/data-master/dosen";
import { getPendaftaranUjianDiterimaByProdi } from "@/actions/pendaftaranUjian";
import PendaftaranUjianTable from "@/components/sekprodi/pendaftaran-ujian/PendaftaranTable";
import { Dosen } from "@/types/Dosen";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/auth";

export default async function PendaftaranUjianPage() {
  const { user } = await getCurrentUserAction();
  const ujianList: Ujian[] = await getPendaftaranUjianDiterimaByProdi(
    user?.prodi?.id || 0
  );

  const dosen: Dosen[] = await getDosen(user?.prodi?.id || 0);

  return (
    <div className="p-6">
      <Suspense fallback={<Loading />}>
        <PendaftaranUjianTable ujianList={ujianList} dosen={dosen} />
      </Suspense>
    </div>
  );
}
