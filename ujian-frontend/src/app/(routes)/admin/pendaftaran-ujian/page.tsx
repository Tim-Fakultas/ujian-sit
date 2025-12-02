import { getCurrentUserAction } from "@/actions/auth";
import { getPendaftaranUjianByProdi } from "@/actions/pendaftaranUjian";
import PendaftaranUjianTable from "@/components/admin/PendaftaranUjianTable";
import { Suspense } from "react";
import Loading from "./loading";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

export default async function PendaftaranUjianPage() {
  const { user } = await getCurrentUserAction();
  const pendaftaranUjian: PendaftaranUjian[] = await getPendaftaranUjianByProdi(
    user?.prodi?.id || 0
  );
  return (
    <div className="p-6">
      <Card className="mb-6 dark:bg-neutral-900 bg-white">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pendaftaran Ujian
            </div>
          </CardTitle>
          <CardDescription>
            Kelola pengajuan rancangan penelitian Anda di sini.
          </CardDescription>
        </CardHeader>
      </Card>
      <Suspense fallback={<Loading />}>
        <PendaftaranUjianTable pendaftaranUjian={pendaftaranUjian} />
      </Suspense>
    </div>
  );
}
