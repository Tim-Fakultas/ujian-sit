import { getPengajuanRanpelByProdi } from "@/actions/pengajuanRanpel";
import PerbaikanJudulClient from "./PerbaikanJudulClient";

export default async function PerbaikanJudulTable({
  prodiId,
}: {
  prodiId: number | undefined;
}) {
  const pengajuanRanpel = await getPengajuanRanpelByProdi(prodiId);

  return <PerbaikanJudulClient pengajuanRanpel={pengajuanRanpel} />;
}
