import { getBeritaUjianByLulus } from "@/actions/beritaUjian";
import { getCurrentUserAction } from "@/actions/auth";
import RekapitulasiNilaiTable from "@/components/sekprodi/rekapitulasi-nilai/rekapitulasiNilaiTable";
import { Suspense } from "react";
import Loading from "./loading";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

export default async function RekapitulasiNilaiPage() {
  const { user } = await getCurrentUserAction();
  const ujian = await getBeritaUjianByLulus(user?.prodi?.id);
  return (
    <div className="p-6">
      <Card className="mb-6 dark:bg-neutral-900 bg-white">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Rekapitulasi Nilai
            </div>
          </CardTitle>
          <CardDescription>Lihat berita acara ujian di sini.</CardDescription>
        </CardHeader>
      </Card>
      <Suspense fallback={<Loading />}>
        <RekapitulasiNilaiTable ujian={ujian} />
      </Suspense>
    </div>
  );
}
