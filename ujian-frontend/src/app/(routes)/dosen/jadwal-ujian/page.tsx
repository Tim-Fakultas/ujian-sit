import { getJadwalUjianByProdiByDosen } from "@/actions/jadwalUjian";
import JadwalUjianTable from "@/app/(routes)/dosen/jadwal-ujian/JadwalUjianTable";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import { getCurrentUserAction } from "@/actions/auth";
import Loading from "./loading";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import Header from "@/components/Header";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian: Ujian[] = await getJadwalUjianByProdiByDosen({
    prodiId: user?.prodi?.id,
    dosenId: user?.id,
  });

  return (
    <div className="p-6">
      <Header title="Jadwal Ujian Mahasiswa" desc="Disini anda dapat melihat jadwal ujian dan melakukan penilaian." />
      <Suspense fallback={<Loading />}>
        <JadwalUjianTable jadwalUjian={jadwalUjian} currentDosenId={user?.id} />
      </Suspense>
    </div>
  );
}
