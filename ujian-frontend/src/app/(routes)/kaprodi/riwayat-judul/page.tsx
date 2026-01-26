import { getCurrentUserAction } from "@/actions/auth";
import { getPerbaikanJudulByProdi } from "@/actions/perbaikanJudul";
import PageHeader from "@/components/common/PageHeader";
import RiwayatJudulTable from "@/components/kaprodi/riwayat-judul/RiwayatJudulTable";

export const metadata = {
    title: "Riwayat Perubahan Judul",
};

export default async function RiwayatJudulPage() {
    const { user } = await getCurrentUserAction();
    const prodiId = user?.prodi?.id;

    // Fetch history of title changes directly
    const riwayatPerubahan = prodiId ? await getPerbaikanJudulByProdi(prodiId) : [];

    return (
        <div className="p-6 md:p-8 flex flex-col gap-6">
            <PageHeader
                title="Riwayat Perubahan Judul"
                description="Daftar riwayat mahasiswa yang mengajukan perubahan judul skripsi."
                iconName="History"
                variant="blue"
            />

            <div className="flex flex-col gap-4">
                <RiwayatJudulTable data={riwayatPerubahan} />
            </div>
        </div>
    );
}
