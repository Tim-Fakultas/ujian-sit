import { getPengajuanRanpelByDosenPA } from "@/actions/pengajuanRanpel";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import PengajuanTableClient from "./PengajuanRanpelClient";

export default async function PengajuanTable({
  userId,
}: {
  userId: number | undefined;
}) {
  const pengajuanRanpel: PengajuanRanpel[] = await getPengajuanRanpelByDosenPA(
    userId
  );

  return <PengajuanTableClient pengajuanRanpel={pengajuanRanpel} />;
}
