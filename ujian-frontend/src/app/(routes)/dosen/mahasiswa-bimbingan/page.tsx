import { getCurrentUserAction } from "@/actions/auth";
import { getDosenBimbinganDetails } from "@/actions/data-master/dosen";
import PageHeader from "@/components/common/PageHeader";
import MahasiswaBimbinganTable, { MahasiswaBimbingan } from "@/components/dosen/mahasiswa-bimbingan/MahasiswaBimbinganTable";

export const metadata = {
    title: "Mahasiswa Bimbingan",
};

export default async function MahasiswaBimbinganPage() {
    const { user } = await getCurrentUserAction();
    const dosenId = user?.id; // ID Dosen yang login

    let dataGabungan: MahasiswaBimbingan[] = [];

    if (dosenId) {
        const details = await getDosenBimbinganDetails(dosenId);
        if (details) {
            // Mapping Pembimbing 1
            const b1 = details.pembimbing1?.map((m: any) => ({
                id: m.id,
                nama: m.nama,
                nim: String(m.nim),
                status: m.status,
                prodi: m.prodi,
                angkatan: String(m.angkatan),
                judul: m.judul,
                peran: 'Pembimbing 1'
            })) || [];

            // Mapping Pembimbing 2
            const b2 = details.pembimbing2?.map((m: any) => ({
                id: m.id,
                nama: m.nama,
                nim: String(m.nim),
                status: m.status,
                prodi: m.prodi,
                angkatan: String(m.angkatan),
                judul: m.judul,
                peran: 'Pembimbing 2'
            })) || [];

            // Mapping Dosen PA
            const pa = details.pa?.map((m: any) => ({
                id: m.id,
                nama: m.nama,
                nim: String(m.nim),
                status: m.status,
                prodi: m.prodi,
                angkatan: String(m.angkatan),
                judul: m.judul,
                peran: 'Dosen PA'
            })) || [];

            // Gabungkan semua data
            // Note: Satu mahasiswa bisa muncul lebih dari sekali jika dosen memiliki peran ganda (misal PA dan Pembimbing 1)
            // Jika ingin dimerge per mahasiswa dan peran digabung (misal "PA & Pembimbing 1"), logic nya akan lebih kompleks.
            // Untuk sekarang biarkan terpisah barisnya agar jelas perannya.
            dataGabungan = [...b1, ...b2, ...pa];
        }
    }

    return (
        <div className="p-6 md:p-8 flex flex-col gap-6">
            <PageHeader
                title="Mahasiswa Bimbingan"
                description="Daftar mahasiswa yang Anda bimbing (Akademik & Skripsi)."
                iconName="Users"
                variant="blue"
            />

            <div className="flex flex-col gap-4">
                <MahasiswaBimbinganTable data={dataGabungan} />
            </div>
        </div>
    );
}
