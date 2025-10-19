import { getLoggedInUser } from "@/actions/pendaftaranUjian";
import { getPengajuanRanpelByDosenPA } from "@/actions/pengajuanRanpel";
import PengajuanTable from "@/components/dosen/PengajuanTable";
import { DosenUser } from "@/types/Auth";

export default async function Page() {
  const loggedInUser: DosenUser = await getLoggedInUser();
  console.log("Logged User:", loggedInUser);
  const pengajuanRanpel = await getPengajuanRanpelByDosenPA(loggedInUser?.id);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Pengajuan Rancangan Penelitian</h1>
      <PengajuanTable
        pengajuanRanpel={pengajuanRanpel}
        loggedUser={loggedInUser}
      />
    </div>
  );
}
