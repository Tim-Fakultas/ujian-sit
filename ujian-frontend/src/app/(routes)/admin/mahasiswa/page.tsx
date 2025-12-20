import { getCurrentUserAction } from "@/actions/auth";
import { Suspense } from "react";
import Loading from "./loading";
import { getAllMahasiswa } from "@/actions/data-master/mahasiswa";
import { getAllDosen } from "@/actions/data-master/dosen";
import { MahasiswaTable } from "./MahasiswaTable";
import PageHeader from "@/components/common/PageHeader";
import { Users } from "lucide-react";
import { Mahasiswa } from "@/types/Mahasiswa";
import { Dosen } from "@/types/Dosen";

export default async function Page() {
  const { user } = await getCurrentUserAction();
  const mahasiswa = await getAllMahasiswa();
  
  // Note: getAllDosen returns all dosen, but for PA selection we might want to filter by prodi
  // However, we'll pass all to the table and let strict logical filtering happen there or here.
  const dosenList: Dosen[] = await getAllDosen();

  // Filter if user has prodi and api returned all
  const filteredMahasiswa = (user?.prodi?.id && Array.isArray(mahasiswa))
      ? mahasiswa.filter((m: Mahasiswa) => m.prodi?.id === user?.prodi?.id) 
      : (Array.isArray(mahasiswa) ? mahasiswa : []);

  const filteredDosen = (user?.prodi?.id && Array.isArray(dosenList))
      ? dosenList.filter((d: Dosen) => d.prodi?.id === user?.prodi?.id)
      : (Array.isArray(dosenList) ? dosenList : []);

  return (
    <div className="p-6 ">
      <PageHeader 
        title="Data Mahasiswa" 
        description="Kelola data mahasiswa di sini." 
        icon={Users}
        variant="emerald"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <MahasiswaTable mahasiswa={filteredMahasiswa} dosenList={filteredDosen} user={user} />
      </Suspense>
    </div>
  );
}
