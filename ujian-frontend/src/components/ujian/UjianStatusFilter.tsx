import { ujianData } from "@/lib/constants";

interface UjianStatusFilterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function UjianStatusFilter({
  activeTab,
  onTabChange,
}: UjianStatusFilterProps) {
  const statusCounts = {
    all: ujianData.length,
    pending: ujianData.filter((i) => i.status === "pending").length,
    dijadwalkan: ujianData.filter((i) => i.status === "dijadwalkan").length,
    selesai: ujianData.filter((i) => i.status === "selesai").length,
  };

  const tabs = [
    { key: "all", label: "Semua", count: statusCounts.all },
    { key: "pending", label: "Menunggu", count: statusCounts.pending },
    {
      key: "dijadwalkan",
      label: "Dijadwalkan",
      count: statusCounts.dijadwalkan,
    },
    { key: "selesai", label: "Selesai", count: statusCounts.selesai },
  ];

  return (
    <div className="mb-6">
      <div className="flex gap-2 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-3 py-1.5 rounded border ${
              activeTab === tab.key
                ? "bg-gray-100 border-gray-300 text-gray-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
    </div>
  );
}
