import PengajuanTable from "@/components/mahasiswa/pengajuan-ranpel/PengajuanTable";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/auth";
// Tambahkan import Card dan icon agar header seragam dengan dosen
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
    <div className="p-6 flex flex-col">
      <Card className="mb-6 dark:bg-neutral-900 bg-white">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pengajuan Rancangan Penelitian
            </div>
          </CardTitle>
          <CardDescription>
            Kelola pengajuan rancangan penelitian Anda di sini.
          </CardDescription>
        </CardHeader>
      </Card>

      <Suspense fallback={<Loading />}>
        <PengajuanTable userId={user?.id} />
      </Suspense>
    </div>
  );
}
