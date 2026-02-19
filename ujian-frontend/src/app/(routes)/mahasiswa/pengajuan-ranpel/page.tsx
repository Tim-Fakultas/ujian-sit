import PengajuanTable from "@/components/mahasiswa/pengajuan-ranpel/PengajuanTable";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/auth";
import PageHeader from "@/components/common/PageHeader";
import { getPengajuanRanpelByMahasiswaId } from "@/actions/pengajuanRanpel";
import { getAllDosen } from "@/actions/data-master/dosen";

export default async function Page() {
  const { user } = await getCurrentUserAction();
  const userId = user?.id;

  // Fetch data on server
  const [pengajuanData, allDosen] = await Promise.all([
    userId ? getPengajuanRanpelByMahasiswaId(userId).catch(() => []) : [],
    getAllDosen().catch(() => []),
  ]);

  const data = pengajuanData || [];
  const dosenList = allDosen || [];

  const targetNipClean = "197508012009122001";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kaprodiObj = dosenList?.find(
    (d: any) => d.nip && d.nip.replace(/\s/g, "") === targetNipClean,
  );

  const kaprodi = kaprodiObj
    ? { nama: kaprodiObj.nama || "", nip: kaprodiObj.nip || "" }
    : { nama: "", nip: "" };

  return (
    <div className="p-6 flex flex-col">
      <PageHeader
        title="Pengajuan Rancangan Penelitian"
        description="Kelola pengajuan rancangan penelitian Anda di sini."
        iconName="FileText"
        variant="blue"
        className="mb-6"
      />

      <Suspense fallback={<Loading />}>
        <PengajuanTable data={data} dosenList={dosenList} kaprodi={kaprodi} />
      </Suspense>
    </div>
  );
}
