export const keputusanOptions = [
  { id: 1, kode: "A", label: "Dapat diterima tanpa perbaikan" },
  { id: 2, kode: "B", label: "Dapat diterima dengan perbaikan kecil" },
  { id: 3, kode: "C", label: "Dapat diterima dengan perbaikan besar" },
  { id: 4, kode: "D", label: "Belum dapat diterima" },
];

export function getNilaiHuruf(rata: number) {
  if (rata >= 80) return "A";
  if (rata >= 70) return "B";
  if (rata >= 60) return "C";
  if (rata >= 56) return "D";
  return "E";
}

export function getPeranPengujiClass(peranPenguji: string | undefined) {
  switch (peranPenguji) {
    case "Ketua Penguji":
      return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
    case "Sekretaris Penguji":
      return "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100";
    case "Penguji 1":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100";
    case "Penguji 2":
      return "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200";
  }
}

export function getStatusUjianClass(statusUjian: string) {
  switch (statusUjian) {
    case "menunggu":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "diterima":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
    case "dijadwalkan":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "selesai":
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200";
  }
}

export const peranPengujiOptions = [
  { label: "Semua", value: "all" },
  { label: "Ketua Penguji", value: "Ketua Penguji" },
  { label: "Sekretaris Penguji", value: "Sekretaris Penguji" },
  { label: "Penguji 1", value: "Penguji 1" },
  { label: "Penguji 2", value: "Penguji 2" },
];
