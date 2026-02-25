import PengajuanTable from "@/components/mahasiswa/pengajuan-ranpel/PengajuanTable";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/auth";
import PageHeader from "@/components/common/PageHeader";
import { getPengajuanRanpelByMahasiswaId } from "@/actions/pengajuanRanpel";
import { getAllDosen } from "@/actions/data-master/dosen";

/**
 * NIP Kaprodi digunakan untuk mengidentifikasi objek Kaprodi dari daftar dosen
 * agar data nama dan NIP-nya bisa disertakan dalam surat pengajuan PDF.
 * Jika Kaprodi berubah, cukup perbarui nilai konstanta ini.
 */
const KAPRODI_NIP = "197508012009122001";

export default async function Page() {
  const { user } = await getCurrentUserAction();

  const [pengajuanData, allDosen] = await Promise.all([
    user?.id ? getPengajuanRanpelByMahasiswaId(user.id).catch(() => []) : [],
    getAllDosen().catch(() => []),
  ]);

  const data = pengajuanData ?? [];
  const dosenList = allDosen ?? [];

  const kaprodiObj = dosenList.find(
    (d) => d.nip && String(d.nip).replace(/\s/g, "") === KAPRODI_NIP,
  );
  const kaprodi = kaprodiObj
    ? { nama: kaprodiObj.nama ?? "", nip: kaprodiObj.nip ?? "" }
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
