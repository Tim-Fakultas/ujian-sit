import PengajuanTable from "@/components/mahasiswa/pengajuan-ranpel/PengajuanTable";
import Form from "@/components/mahasiswa/pengajuan-ranpel/Form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/loginAction";

export default async function Page() {
  const { user } = await getCurrentUserAction();

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="w-full flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Rancangan Penelitian</h1>
          <p>Lihat semua pengajuan rancangan penelitian</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-400 hover:bg-blue-500 text-white">
              <Plus className="mr-2" />
              Tambah Pengajuan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-lg font-medium mb-4">
              Form Rancangan Penelitian
            </DialogTitle>
            {user && <Form mahasiswaId={user.id} />}
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Pengajuan Rancangan Penelitian component */}
      <Suspense fallback={<Loading />}>
        <PengajuanTable userId={user?.id} />
      </Suspense>
    </div>
  );
}
