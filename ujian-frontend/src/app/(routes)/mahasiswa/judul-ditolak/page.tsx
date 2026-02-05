import { Suspense } from "react";
import PageHeader from "@/components/common/PageHeader";
import { getRejectedRanpels } from "@/actions/rancanganPenelitian";
import Loading from "../pengajuan-ranpel/loading";
import JudulDitolakTable from "@/components/mahasiswa/judul-ditolak/JudulDitolakTable";

export default async function Page() {
    const data = await getRejectedRanpels();

    return (
        <div className="p-6 flex flex-col space-y-6">
            <PageHeader
                title="Judul Ditolak"
                description="Daftar judul skripsi yang belum disetujui atau memerlukan perbaikan."
                iconName="XCircle"
                variant="rose" // Using red for rejected status
            />

            <Suspense fallback={<Loading />}>
                <JudulDitolakTable data={data} />
            </Suspense>
        </div>
    );
}
