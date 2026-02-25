"use client";

import { CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";

interface StatCardsProps {
  data: PengajuanRanpel[];
}

export function StatCards({ data }: StatCardsProps) {
  const stats = {
    total: data.length,
    accepted: data.filter((p) => p.status?.toLowerCase() === "diterima").length,
    rejected: data.filter((p) => p.status?.toLowerCase() === "ditolak").length,
    pending: data.filter(
      (p) =>
        p.status?.toLowerCase() === "menunggu" ||
        p.status?.toLowerCase() === "diverifikasi",
    ).length,
  };

  const items = [
    {
      label: "Total Pengajuan",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Diterima",
      value: stats.accepted,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Menunggu / Verifikasi",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "Ditolak",
      value: stats.rejected,
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map((item) => (
        <DataCard
          key={item.label}
          className="p-4 sm:p-4 flex items-center gap-4"
        >
          <div className={`p-3 rounded-full ${item.bgColor} ${item.color}`}>
            <item.icon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {item.label}
            </p>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        </DataCard>
      ))}
    </div>
  );
}
