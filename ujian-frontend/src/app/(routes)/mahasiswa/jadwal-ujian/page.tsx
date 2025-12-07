import { getHadirUjian } from "@/actions/daftarHadirUjian";
import { getJadwalUjianByProdi } from "@/actions/jadwalUjian";
import { getCurrentUserAction } from "@/actions/auth";
import JadwalUjianTable from "@/components/mahasiswa/jadwal-ujian/JadwalUjianTable";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian = await getJadwalUjianByProdi(user?.prodi?.id || 0);

  const daftarHadir = await getHadirUjian();

  return (
    <div className="p-6">
      <Card className="mb-6 dark:bg-neutral-900 bg-white">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Jadwal Ujian 
            </div>
          </CardTitle>
          <CardDescription>
            Lihat jadwal ujian di sini. 
          </CardDescription>
        </CardHeader>
      </Card>
      <JadwalUjianTable
        jadwalUjian={jadwalUjian}
        daftarHadir={daftarHadir}
        userId={user?.id}
      />
    </div>
  );
}
