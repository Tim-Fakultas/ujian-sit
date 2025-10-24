import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { getPengajuanRanpelByMahasiswaId } from "@/actions/pengajuanRanpel";
import PengajuanTableClient from "./PengajuanTableClient";

export default async function PengajuanTable({
  userId,
}: {
  userId: number | undefined;
}) {
  const data: PengajuanRanpel[] = await getPengajuanRanpelByMahasiswaId(userId);

  return <PengajuanTableClient data={data} />;
}
