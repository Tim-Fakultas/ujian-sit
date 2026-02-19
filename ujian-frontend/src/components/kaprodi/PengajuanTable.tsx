import { getKaprodiPengajuanRanpel } from "@/actions/kaprodi";

import PengajuanTableClient from "./PengajuanRanpelClient";

export default async function PengajuanTable({
  prodiId,
}: {
  prodiId: number | undefined;
}) {
  const pengajuanRanpel = await getKaprodiPengajuanRanpel();

  return <PengajuanTableClient pengajuanRanpel={pengajuanRanpel} />;
}
