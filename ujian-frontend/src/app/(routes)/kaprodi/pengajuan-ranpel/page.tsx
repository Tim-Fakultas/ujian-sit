import { getLoggedInUser } from "@/actions/pendaftaranUjian";
import { getPengajuanRanpelByProdi } from "@/actions/pengajuanRanpel";
import PengajuanTable from "@/components/kaprodi/PengajuanTable";

export default async function Page() {
  const loggedInUser = await getLoggedInUser();
  const pengajuanRanpel = await getPengajuanRanpelByProdi(
    loggedInUser?.prodi.id
  );
  console.log("Logged User:", loggedInUser);
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
