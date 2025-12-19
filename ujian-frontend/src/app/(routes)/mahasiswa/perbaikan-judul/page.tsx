import { Suspense } from "react";
import { getCurrentUserAction } from "@/actions/auth";
import { getPengajuanRanpelByMahasiswaId } from "@/actions/pengajuanRanpel";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/common/PageHeader";
import { PencilLine, FileWarning } from "lucide-react";
import FormPerbaikanJudul from "@/components/mahasiswa/perbaikan-judul/FormPerbaikanJudul";
import Loading from "./loading";

export const metadata = {
  title: "Perbaikan Judul Skripsi",
  description: "Halaman untuk mengajukan perbaikan judul skripsi mahasiswa",
};

export default async function Page() {
  const { user } = await getCurrentUserAction();
  
  // Logic to get the current accepted proposal
  let activeRanpel = null;
  let message = "";

  if (user?.id) {
    const pengajuanList = await getPengajuanRanpelByMahasiswaId(user.id);
    // Prioritize 'diterima' (accepted) proposals, then take the latest
    const acceptedRanpel = pengajuanList?.filter(p => p.status === 'diterima') || [];
    
    // If no accepted, maybe they are in process? But perbaikan judul implies you have a title.
    // Let's assume we take the latest accepted one.
    if (acceptedRanpel.length > 0) {
        // Sort by date desc just in case
        // Assuming the API might sort, but let's be safe if we rely on [0]
        acceptedRanpel.sort((a, b) => new Date(b.tanggalPengajuan).getTime() - new Date(a.tanggalPengajuan).getTime());
        activeRanpel = acceptedRanpel[0];
    } else if (pengajuanList && pengajuanList.length > 0) {
        // Fallback: Show the latest one regardless of status, but maybe warn?
        // Actually, usually you fix title after it's accepted.
        // For now let's just take the latest one to allow testing if they haven't been 'accepted' in the dev DB yet.
         activeRanpel = pengajuanList[0];
    }
  }

  // If no active proposal found
  if (!activeRanpel) {
      return (
          <div className="p-6">
               <Card className="bg-yellow-50/50 dark:bg-yellow-900/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
                        <FileWarning className="h-5 w-5" />
                        Data Tidak Ditemukan
                    </CardTitle>
                    <CardDescription className="text-yellow-700/80 dark:text-yellow-500/80">
                        Anda belum memiliki data pengajuan rancangan penelitian yang disetujui. Silakan ajukan rancangan penelitian terlebih dahulu.
                    </CardDescription>
                </CardHeader>
               </Card>
          </div>
      )
  }

  return (
    <div className="p-6 flex flex-col space-y-6">
      {/* Header Page */}
      {/* Header Page */}
      <PageHeader 
        title="Perbaikan Judul Skripsi"
        description="Halaman ini digunakan untuk mengajukan perubahan judul skripsi yang telah disetujui sebelumnya."
        icon={PencilLine}
        variant="blue"
      />

      <Suspense fallback={<Loading />}>
          <FormPerbaikanJudul 
            mahasiswaId={activeRanpel.mahasiswa.id}
            ranpelId={activeRanpel.ranpel.id!}
            judulLama={activeRanpel.ranpel.judulPenelitian}
            updatedAt={activeRanpel.ranpel.updatedAt}
          />
      </Suspense>
    </div>
  );
}
