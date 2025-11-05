import { getJadwalUjianByProdiByDosen } from "@/actions/jadwalUjian";
import JadwalUjianTable from "@/components/dosen/JadwalUjianTable";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import { getCurrentUserAction } from "@/actions/loginAction";
import Loading from "./loading";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian: Ujian[] = await getJadwalUjianByProdiByDosen({
    prodiId: user?.prodi?.id,
    dosenId: user?.id,
  });

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-semibold">Jadwal Ujian</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Berikut adalah jadwal ujian yang telah dijadwalkan.
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        <JadwalUjianTable jadwalUjian={jadwalUjian} currentDosenId={user?.id} />
      </Suspense>
    </div>
  );
}
