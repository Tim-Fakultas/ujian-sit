import { getCurrentUserAction } from "@/actions/auth";
import { Suspense } from "react";
import Loading from "./loading";
import { getDosen } from "@/actions/data-master/dosen";
import { Dosen } from "@/types/Dosen";
import { DosenTable } from "./DosenTable";
import PageHeader from "@/components/common/PageHeader";
import { Users } from "lucide-react";

export default async function Page() {
  const { user } = await getCurrentUserAction();
  const dosen: Dosen[] = await getDosen(user?.prodi?.id);
  return (
    <div className="p-6 ">
      <PageHeader 
        title="Data Dosen" 
        description="Kelola data dosen di sini." 
        iconName="Users"
        variant="emerald"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <DosenTable dosen={dosen} user={user} />
      </Suspense>
    </div>
  );
}
