import { getUjianForAdmin } from "@/actions/beritaUjian";
import AdminUjianTable from "@/components/admin/ujian/AdminUjianTable";

export default async function UjianTableWrapper() {
  const ujian = await getUjianForAdmin();
  return <AdminUjianTable ujian={ujian} />;
}
