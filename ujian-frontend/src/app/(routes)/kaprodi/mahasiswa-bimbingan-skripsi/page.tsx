import PageHeader from "@/components/common/PageHeader";
import MahasiswaBimbingan from "@/components/mahasiswaBimbingan";
import { FileText } from "lucide-react";
import { Suspense } from "react";
import PageLoading from "./loading";


export const dynamic = "force-dynamic";

export default function MahasiswaBimbinganPage() {
    return (
        <div className="p-6">
            <PageHeader
                title="Mahasiswa Bimbingan"
                description="Daftar mahasiswa bimbingan program studi Anda."
                iconName="FileText"
                variant="emerald"
                className="mb-6"
            />

            <Suspense fallback={<PageLoading />}>
                <MahasiswaBimbingan />
            </Suspense>
        </div>
    )
}