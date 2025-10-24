import { getJadwalaUjianByProdi } from "@/actions/jadwalUjian";
import JadwalUjianTable from "@/components/sekprodi/pendaftaran-ujian/jadwalUjianTable";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/loginAction";
import { getHadirUjian } from "@/actions/daftarHadirUjian";

export default async function JadwalUjianPage() {
  // const loggedInUser = await getLoggedInUser();
  const { user } = await getCurrentUserAction();
  const jadwalUjian: Ujian[] =
    user?.prodi?.id !== undefined
      ? await getJadwalaUjianByProdi(user.prodi.id)
      : [];

  const daftarHadir = await getHadirUjian();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Jadwal Ujian</h1>
      <Suspense fallback={<Loading />}>
        <JadwalUjianTable jadwalUjian={jadwalUjian} daftarHadir={daftarHadir} />
      </Suspense>
    </div>
  );
}
