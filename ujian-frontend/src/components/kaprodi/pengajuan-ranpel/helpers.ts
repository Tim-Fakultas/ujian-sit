import { DateRange } from "react-day-picker";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import type { FilterState } from "./types";

/**
 * Format a date string to Indonesian locale (e.g. "25/02/2026").
 * Returns null if the value is empty or invalid.
 */
export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new Date(value).toLocaleDateString("id-ID");
  } catch {
    return null;
  }
}

/**
 * Check whether a date string falls within a given DateRange.
 * The "from" boundary is inclusive at 00:00 and "to" is inclusive at 23:59.
 */
export function isDateInRange(dateStr: string, range: DateRange): boolean {
  const itemDate = new Date(dateStr);

  const from = new Date(range.from!);
  from.setHours(0, 0, 0, 0);

  if (range.to) {
    const to = new Date(range.to);
    to.setHours(23, 59, 59, 999);
    return itemDate >= from && itemDate <= to;
  }

  return itemDate >= from;
}

/**
 * Apply all active filters to a list of pengajuan ranpel.
 * Returns a new array — does not mutate the original.
 */
export function applyFilters(
  data: PengajuanRanpel[],
  filters: FilterState,
): PengajuanRanpel[] {
  const query = filters.search.trim().toLowerCase();

  return data.filter((item) => {
    const nama = (item.mahasiswa?.nama ?? "").toLowerCase();
    const nim = (item.mahasiswa?.nim ?? "").toLowerCase();
    const judul = (item.ranpel?.judulPenelitian ?? "").toLowerCase();
    const status = (item.status ?? "").toLowerCase();
    const tanggal = (item.tanggalPengajuan ?? "").toString().toLowerCase();
    const angkatan = (item.mahasiswa?.angkatan ?? "").toString();

    const matchesQuery =
      !query ||
      nama.includes(query) ||
      nim.includes(query) ||
      judul.includes(query) ||
      status.includes(query) ||
      tanggal.includes(query);

    const matchesStatus = filters.status === "all" || status === filters.status;

    const matchesAngkatan =
      filters.angkatan === "all" || angkatan === filters.angkatan;

    const matchesDate =
      !filters.dateRange?.from || isDateInRange(tanggal, filters.dateRange);

    return matchesQuery && matchesStatus && matchesAngkatan && matchesDate;
  });
}
