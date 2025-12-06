import { getDosen } from "@/actions/data-master/dosen";
import { getPendaftaranUjianDiterimaByProdi } from "@/actions/pendaftaranUjian";
import PendaftaranUjianTable from "@/components/sekprodi/pendaftaran-ujian/PendaftaranTable";
import { Dosen } from "@/types/Dosen";
import { Ujian } from "@/types/Ujian";
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

export default async function PendaftaranUjianPage() {
  const { user } = await getCurrentUserAction();
  const ujianList: Ujian[] = await getPendaftaranUjianDiterimaByProdi(
    user?.prodi?.id || 0
  );

  const dosen: Dosen[] = await getDosen(user?.prodi?.id || 0);

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
            Kelola pendaftaran ujian mahasiswa di sini.
          </CardDescription>
        </CardHeader>
      </Card>
      <Suspense fallback={<Loading />}>
        <PendaftaranUjianTable ujianList={ujianList} dosen={dosen} />
      </Suspense>
    </div>
  );
}
