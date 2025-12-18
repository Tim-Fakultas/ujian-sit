import { getJadwalUjianByProdi } from "@/actions/jadwalUjian";
import JadwalUjianTable from "@/components/sekprodi/penjadwalan-ujian/PenjadwalkanUjianTable";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import { getCurrentUserAction } from "@/actions/auth";
import { getHadirUjian } from "@/actions/daftarHadirUjian";
import Loading from "./loading";
import Header from "@/components/Header";
import { getDosen } from "@/actions/data-master/dosen";
import { getRuangan } from "@/actions/data-master/ruangan"; // Import getRuangan
import PenjadwalkanUjianTable from "@/components/sekprodi/penjadwalan-ujian/PenjadwalkanUjianTable";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian: Ujian[] =
    user?.prodi?.id !== undefined
      ? await getJadwalUjianByProdi(user.prodi.id)
      : [];

  const ruanganList = await getRuangan();
  const daftarHadir = await getHadirUjian();
  const dosen = await getDosen(user?.prodi?.id);

  return (
    <div className="p-6">
      <Header title="Penjadwalan Ujian" desc="Kelola penjadwalan ujian di sini." />
      <Suspense fallback={<Loading />}>
        <PenjadwalkanUjianTable
          jadwalUjian={jadwalUjian}
          daftarHadir={daftarHadir}
          dosen={dosen}
          ruanganList={ruanganList}
        />
      </Suspense>
    </div>
  );
}
