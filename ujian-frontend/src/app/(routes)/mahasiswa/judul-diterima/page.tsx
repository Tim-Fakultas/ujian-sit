import { Suspense } from "react";
import PageHeader from "@/components/common/PageHeader";
import { getAcceptedRanpels } from "@/actions/rancanganPenelitian";
import Loading from "../pengajuan-ranpel/loading";
import JudulDiterimaTable from "@/components/mahasiswa/judul-diterima/JudulDiterimaTable";

export default async function Page() {
    const data = await getAcceptedRanpels();

    return (
        <div className="p-6 flex flex-col space-y-6">
            <PageHeader
                title="Judul Diterima"
                description="Daftar judul skripsi yang telah disetujui."
                iconName="CheckCircle2"
                variant="emerald" // Using green for accepted status
            />

            <Suspense fallback={<Loading />}>
                <JudulDiterimaTable data={data} />
            </Suspense>
        </div>
    );
}
