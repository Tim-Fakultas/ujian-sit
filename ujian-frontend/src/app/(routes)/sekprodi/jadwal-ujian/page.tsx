import { getJadwalUjianByProdi } from "@/actions/jadwalUjian";
import JadwalUjianTable from "@/components/sekprodi/pendaftaran-ujian/jadwalUjianTable";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import { getCurrentUserAction } from "@/actions/auth";
import { getHadirUjian } from "@/actions/daftarHadirUjian";
import Loading from "./loading";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian: Ujian[] =
    user?.prodi?.id !== undefined
      ? await getJadwalUjianByProdi(user.prodi.id)
      : [];

  const daftarHadir = await getHadirUjian();
  return (
    <div className="p-6">
      <Suspense fallback={<Loading />}>
        <JadwalUjianTable jadwalUjian={jadwalUjian} daftarHadir={daftarHadir} />
      </Suspense>
    </div>
  );
}
