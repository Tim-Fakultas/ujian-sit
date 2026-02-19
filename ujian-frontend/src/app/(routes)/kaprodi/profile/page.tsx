import { getCurrentUserAction } from "@/actions/auth";
import DosenProfileCard from "../../dosen/profile/DosenProfileCard";
import { Suspense } from "react";
import Loading from "./loading";
import { getDosenBimbinganDetails } from "@/actions/data-master/dosen";

export default async function KaprodiProfilePage() {
  const { user } = await getCurrentUserAction();
  let bimbinganCount = 0;

  if (user?.id) {
    const bimbinganDetails = await getDosenBimbinganDetails(user.id);
    const mhsBimbinganIds = new Set<number>();
    if (bimbinganDetails) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bimbinganDetails.pembimbing1?.forEach((m: any) =>
        mhsBimbinganIds.add(m.id),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bimbinganDetails.pembimbing2?.forEach((m: any) =>
        mhsBimbinganIds.add(m.id),
      );
    }
    bimbinganCount = mhsBimbinganIds.size;
  }

  return (
    <main className="p-4 sm:p-6 max-w-full">
      <Suspense fallback={<Loading />}>
        <DosenProfileCard user={user} bimbinganCount={bimbinganCount} />
      </Suspense>
    </main>
  );
}
