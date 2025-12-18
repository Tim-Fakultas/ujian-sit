import { LayoutDashboard, Users, BookOpen, GraduationCap, Building2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { DataCard } from "@/components/common/DataCard";

async function getTotalDosen() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/dosen`, { cache: "no-store" });
    if (!res.ok) return 0;
    const data = await res.json();
    return data?.data?.length ?? 0;
  } catch (error) {
    return 0;
  }
}
async function getTotalMahasiswa() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/mahasiswa`, { cache: "no-store" });
    if (!res.ok) return 0;
    const data = await res.json();
    return data?.data?.length ?? 0;
  } catch (error) {
    return 0;
  }
}
async function getTotalPeminatan() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/peminatan`, { cache: "no-store" });
    if (!res.ok) return 0;
    const data = await res.json();
    return data?.data?.length ?? 0;
  } catch (error) {
    return 0;
  }
}
async function getTotalProdi() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/prodi`, { cache: "no-store" });
    if (!res.ok) return 0;
    const data = await res.json();
    return data?.data?.length ?? 0;
  } catch (error) {
    return 0;
  }
}

export default async function Page() {
  const totalDosen = await getTotalDosen();
  const totalMahasiswa = await getTotalMahasiswa();
  const totalPeminatan = await getTotalPeminatan();
  const totalProdi = await getTotalProdi();

  const stats = [
    {
      label: "Total Dosen",
      value: totalDosen,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-100 dark:border-blue-900",
    },
    {
      label: "Total Mahasiswa",
      value: totalMahasiswa,
      icon: GraduationCap,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-100 dark:border-green-900",
    },
    {
      label: "Total Peminatan",
      value: totalPeminatan,
      icon: BookOpen,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-100 dark:border-purple-900",
    },
    {
      label: "Total Prodi",
      value: totalProdi,
      icon: Building2,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-100 dark:border-amber-900",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Dashboard Super Admin"
        description="Ringkasan data akademik Faculty of Science & Technology"
        icon={LayoutDashboard}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <DataCard key={index} className={`p-4 flex items-center gap-4 ${stat.border}`}>
            <div className={`p-3 rounded-full ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</h3>
            </div>
          </DataCard>
        ))}
      </div>
    </div>
  );
}
