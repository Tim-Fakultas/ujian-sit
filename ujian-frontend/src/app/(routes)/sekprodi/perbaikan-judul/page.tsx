import { getCurrentUserAction } from "@/actions/auth";
import { Suspense } from "react";
import Loading from "./loading";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import PerbaikanJudulTable from "./PerbaikanJudulTable";

export default async function Page() {
  const { user } = await getCurrentUserAction();

  return (
    <div className="p-6">
      <Card className="mb-6 dark:bg-neutral-900 bg-white">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Perbaikan Judul Skripsi
            </div>
          </CardTitle>
          <CardDescription>
            Daftar perbaikan judul skripsi program studi Anda.
          </CardDescription>
        </CardHeader>
      </Card>

      <Suspense fallback={<Loading />}>
        <PerbaikanJudulTable prodiId={user?.prodi?.id} />
      </Suspense>
    </div>
  );
}
