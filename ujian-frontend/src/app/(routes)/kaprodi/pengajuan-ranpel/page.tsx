import { getKaprodiPengajuanRanpel } from "@/actions/kaprodi";
import PengajuanTable from "@/components/kaprodi/pengajuan-ranpel/PengajuanTable";
import PageHeader from "@/components/common/PageHeader";
import { Suspense } from "react";
import Loading from "./loading";

export default async function PengajuanRanpelPage() {
  const rawData = await getKaprodiPengajuanRanpel();

  // Urutkan dari yang paling baru mengajukan (terbaru di atas)
  const pengajuanRanpel = [...(rawData ?? [])].sort((a, b) => {
    const dateA = a.tanggalPengajuan
      ? new Date(a.tanggalPengajuan).getTime()
      : 0;
    const dateB = b.tanggalPengajuan
      ? new Date(b.tanggalPengajuan).getTime()
      : 0;
    return dateB - dateA;
  });

  return (
    <div className="p-6">
      <PageHeader
        title="Pengajuan Rancangan Penelitian"
        description="Daftar pengajuan rancangan penelitian program studi Anda."
        iconName="FileText"
        variant="emerald"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <PengajuanTable pengajuanRanpel={pengajuanRanpel} />
      </Suspense>
    </div>
  );
}
