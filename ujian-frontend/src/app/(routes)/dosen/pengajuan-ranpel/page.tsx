import { getCurrentUserAction } from "@/actions/auth";
import PengajuanTable from "@/components/dosen/PengajuanTable";
import { Suspense } from "react";
import Loading from "./loading";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

export default async function Page() {
  const { user } = await getCurrentUserAction();

  return (
    <div className="p-6">
      <Card className="mb-6 dark:bg-neutral-900 bg-white">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pengajuan Rancangan Penelitian
            </div>
          </CardTitle>
          <CardDescription>
            Daftar pengajuan rancangan penelitian mahasiswa anda.
          </CardDescription>
        </CardHeader>
      </Card>
      <Suspense fallback={<Loading />}>
        <PengajuanTable userId={user?.id} />
      </Suspense>
    </div>
  );
}
