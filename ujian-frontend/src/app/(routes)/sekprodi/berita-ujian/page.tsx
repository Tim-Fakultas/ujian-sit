import { getBeritaUjian } from "@/actions/beritaUjian";
import { getHadirUjian } from "@/actions/daftarHadirUjian";
import BeritaAcaraUjianTable from "@/components/sekprodi/pendaftaran-ujian/beritaAcaraTable";
import { BeritaUjian } from "@/types/BeritaUjian";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/auth";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

export default async function BeritaUjianPage() {
  const { user } = await getCurrentUserAction();
  const beritaUjian: BeritaUjian[] = await getBeritaUjian(user?.prodi?.id);

  const daftarKehadiran = await getHadirUjian();

  return (
    <div className="p-6">
      <Card className="mb-6 dark:bg-neutral-900 bg-white">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Berita Acara Ujian
            </div>
          </CardTitle>
          <CardDescription>
            Lihat berita acara ujian di sini.
          </CardDescription>
        </CardHeader>
      </Card>
      <Suspense fallback={<Loading />}>
        <BeritaAcaraUjianTable
          beritaUjian={beritaUjian}
          daftarKehadiran={daftarKehadiran}
        />
      </Suspense>
    </div>
  );
}
