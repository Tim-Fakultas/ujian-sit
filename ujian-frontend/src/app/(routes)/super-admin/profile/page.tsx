import { DataCard } from "@/components/common/DataCard";
import PageHeader from "@/components/common/PageHeader";
import { UserCircle } from "lucide-react";

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Profil Super Admin"
        description="Informasi akun dan pengaturan profil"
        icon={UserCircle}
      />
      <DataCard>
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-full mb-4">
                <UserCircle className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Informasi Pengguna
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                Halaman profil ini sedang dalam pengembangan. Fitur untuk mengelola informasi akun Anda akan segera tersedia.
            </p>
        </div>
      </DataCard>
    </div>
  );
}
