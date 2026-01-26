import { getCurrentUserAction } from "@/actions/auth";
import { getPerbaikanJudulByDosen } from "@/actions/perbaikanJudul";
import PageHeader from "@/components/common/PageHeader";
import RiwayatJudulTable from "@/components/dosen/riwayat-judul/RiwayatJudulTable";

export const metadata = {
    title: "Riwayat Perubahan Judul",
};

export default async function RiwayatJudulPage() {
    const { user } = await getCurrentUserAction();
    const dosenId = user?.id; // ID dosen yang login

    // Fetch history of title changes for students under this lecturer (Dosen PA)
    const riwayatPerubahan = dosenId ? await getPerbaikanJudulByDosen(dosenId) : [];

    return (
        <div className="p-6 md:p-8 flex flex-col gap-6">
            <PageHeader
                title="Riwayat Perubahan Judul"
                description="Daftar riwayat mahasiswa bimbingan yang mengajukan perubahan judul skripsi."
                iconName="History"
                variant="blue"
            />

            <div className="flex flex-col gap-4">
                <RiwayatJudulTable data={riwayatPerubahan} />
            </div>
        </div>
    );
}
