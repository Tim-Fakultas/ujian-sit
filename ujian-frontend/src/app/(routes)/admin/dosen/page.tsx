import { getCurrentUserAction } from "@/actions/auth";
import { Suspense } from "react";
import Loading from "./Loading";
import { getDosen } from "@/actions/data-master/dosen";
import { Dosen } from "@/types/Dosen";
import { DosenTable } from "./DosenTable";

export default async function Page() {
  const { user } = await getCurrentUserAction();
  const dosen: Dosen[] = await getDosen(user?.prodi?.id);
  return (
    <div className="p-6 ">
      <Suspense fallback={<Loading />}>
        <DosenTable dosen={dosen} user={user} />
      </Suspense>
    </div>
  );
}
