import { getCurrentUserAction } from "@/actions/auth";
import { getDosenBimbinganDetails } from "@/actions/data-master/dosen";
import PageHeader from "@/components/common/PageHeader";
import MahasiswaBimbinganTable, { MahasiswaBimbingan } from "@/components/dosen/mahasiswa-bimbingan-skripsi/MahasiswaBimbinganTable";

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
            const studentMap = new Map<number, MahasiswaBimbingan>();

            const processList = (list: any[], role: string) => {
                if (!list) return;
                list.forEach((m) => {
                    const existing = studentMap.get(m.id);
                    if (existing) {
                        if (!existing.peran.includes(role)) {
                            existing.peran += `, ${role}`;
                        }
                    } else {
                        studentMap.set(m.id, {
                            id: m.id,
                            nama: m.nama,
                            nim: String(m.nim),
                            status: m.status,
                            prodi: m.prodi,
                            angkatan: String(m.angkatan),
                            judul: m.judul,
                            peran: role,
                            pembimbing1: m.pembimbing1,
                            pembimbing2: m.pembimbing2,
                        });
                    }
                });
            };

            processList(details.pembimbing1, 'Pembimbing 1');
            processList(details.pembimbing2, 'Pembimbing 2');

            dataGabungan = Array.from(studentMap.values());
        }
    }

    return (
        <div className="p-6 md:p-8 flex flex-col gap-6">
            <PageHeader
                title="Mahasiswa Bimbingan Skripsi"
                description="Daftar mahasiswa yang bimbingan skripsi dengan anda."
                iconName="Users"
                variant="blue"
            />

            <div className="flex flex-col gap-4">
                <MahasiswaBimbinganTable data={dataGabungan} />
            </div>
        </div>
    );
}
