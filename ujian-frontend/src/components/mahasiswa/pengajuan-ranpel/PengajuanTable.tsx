import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { getPengajuanRanpelByMahasiswaId } from "@/actions/pengajuanRanpel";
import PengajuanTableClient from "./PengajuanTableClient";

export default async function PengajuanTable({
  userId,
}: {
  userId: number | undefined;
}) {
  // If no userId provided, avoid calling the API and return empty array to client
  if (typeof userId === "undefined" || userId === null) {
    // optional: you can log or track this case for debugging
    console.warn("[PengajuanTable] userId is undefined, returning empty data");
    return <PengajuanTableClient data={[]} />;
  }

  let data: PengajuanRanpel[] = [];
  try {
    data = (await getPengajuanRanpelByMahasiswaId(userId)) || [];
  } catch (err) {
    console.error("[PengajuanTable] failed to fetch pengajuan ranpel:", err);
    data = [];
  }

  return <PengajuanTableClient data={data} />;
}
