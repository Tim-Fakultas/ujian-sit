import { getCurrentUserAction } from "@/actions/loginAction";
import { Suspense } from "react";
import Loading from "./Loading";
import { getDosen } from "@/actions/dosen";
import DosenTable from "./DosenTable";
import { Dosen } from "@/types/Dosen";

export default async function Page() {
  const { user } = await getCurrentUserAction();
  const dosen: Dosen[] = await getDosen(user?.prodi?.id);
  return (
    <div className="p-6 ">
      <h1 className="font-semibold text-neutral-700 text-2xl mb-4">
        Dosen Prodi {user?.prodi?.nama_prodi}
      </h1>

      <Suspense fallback={<Loading />}>
        <div>
          <DosenTable dosen={dosen} />
        </div>
      </Suspense>
    </div>
  );
}
