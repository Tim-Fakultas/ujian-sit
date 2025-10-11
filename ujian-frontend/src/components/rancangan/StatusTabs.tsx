"use client";

import { rancanganData } from "@/lib/constants";

interface StatusTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function StatusTabs({ activeTab, onTabChange }: StatusTabsProps) {
  return (
    <div className="flex gap-2 text-xs">
      <button
        onClick={() => onTabChange("all")}
        className={`px-3 py-1.5 rounded border ${
          activeTab === "all"
            ? "bg-gray-100 border-gray-300 text-gray-700"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        Semua ({rancanganData.length})
      </button>
      <button
        onClick={() => onTabChange("pending")}
        className={`px-3 py-1.5 rounded border ${
          activeTab === "pending"
            ? "bg-gray-100 border-gray-300 text-gray-700"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        Pending ({rancanganData.filter((i) => i.status === "pending").length})
      </button>
      <button
        onClick={() => onTabChange("disetujui")}
        className={`px-3 py-1.5 rounded border ${
          activeTab === "disetujui"
            ? "bg-gray-100 border-gray-300 text-gray-700"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        Disetujui (
        {rancanganData.filter((i) => i.status === "disetujui").length})
      </button>
      <button
        onClick={() => onTabChange("ditolak")}
        className={`px-3 py-1.5 rounded border ${
          activeTab === "ditolak"
            ? "bg-gray-100 border-gray-300 text-gray-700"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        Ditolak ({rancanganData.filter((i) => i.status === "ditolak").length})
      </button>
    </div>
  );
}
