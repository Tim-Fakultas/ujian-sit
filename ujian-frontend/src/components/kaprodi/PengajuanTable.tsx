import { getPengajuanRanpelByProdi } from "@/actions/pengajuanRanpel";

import PengajuanTableClient from "./PengajuanRanpelClient";

export default async function PengajuanTable({
  prodiId,
}: {
  prodiId: number | undefined;
}) {
  const pengajuanRanpel = await getPengajuanRanpelByProdi(prodiId);

  return <PengajuanTableClient pengajuanRanpel={pengajuanRanpel} />;
}
