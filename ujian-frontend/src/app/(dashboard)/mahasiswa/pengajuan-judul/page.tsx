import { DataTable } from '@/components/data-table';
import data from '@/lib/data.json'

export default function MahasiswaPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <DataTable data={data} />
    </div>
  );
}
