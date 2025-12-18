import { getJadwalUjianByProdi } from "@/actions/jadwalUjian";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import { getCurrentUserAction } from "@/actions/auth";
import { getHadirUjian } from "@/actions/daftarHadirUjian";
import Loading from "./loading";
import Header from "@/components/Header";
import JadwalUjianTable from "@/components/sekprodi/pendaftaran-ujian/jadwalUjianTable";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian: Ujian[] =
    user?.prodi?.id !== undefined
      ? await getJadwalUjianByProdi(user.prodi.id)
      : [];
  const daftarHadir = await getHadirUjian();

  return (
    <div className="p-6">
      <Header title="Jadwal Ujian" desc="Kelola jadwal ujian di sini." />
      <Suspense fallback={<Loading />}>
        <JadwalUjianTable
          jadwalUjian={jadwalUjian}
          daftarHadir={daftarHadir}
        />
      </Suspense>
    </div>
  );
}
