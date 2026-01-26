import { getMonitorBimbingan } from "@/actions/data-master/dosen";
import MahasiswaBimbinganTable from "./kaprodi/MahasiswaBimbinganTable";

export default async function MahasiswaBimbingan() {
    const data = await getMonitorBimbingan();

    return (
        <div>
            <MahasiswaBimbinganTable data={data} />
        </div>
    )
}