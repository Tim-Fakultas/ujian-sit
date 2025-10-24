import { getJadwalUjianByProdiByDosen } from "@/actions/jadwalUjian";
import JadwalUjianTable from "@/components/dosen/JadwalUjianTable";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/loginAction";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian: Ujian[] = await getJadwalUjianByProdiByDosen({
    prodiId: user?.prodi?.id,
    dosenId: user?.id,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Jadwal Ujian</h1>
      <Suspense fallback={<Loading />}>
        <JadwalUjianTable jadwalUjian={jadwalUjian} currentDosenId={user?.id} />
      </Suspense>
    </div>
  );
}
