import { Ujian } from "@/types/Ujian";

export function sudahHadir(
  ujianId: number,
  dosenId: number | undefined,
  hadirData: { ujianId: number; dosenId: number; statusKehadiran: string }[]
): boolean {
  if (!dosenId) return false;
  return hadirData.some(
    (h) =>
      h.ujianId === ujianId &&
      h.dosenId === dosenId &&
      h.statusKehadiran === "hadir"
  );
}

export function getPengujiList(ujian: Ujian) {
  if (!Array.isArray(ujian?.penguji)) return [];
  return ujian.penguji.map((p) => ({
    ...p,
    label:
      p.peran === "ketua_penguji"
        ? "Ketua Penguji"
        : p.peran === "sekretaris_penguji"
        ? "Sekretaris Penguji"
        : p.peran === "penguji_1"
        ? "Penguji I"
        : p.peran === "penguji_2"
        ? "Penguji II"
        : p.peran,
  }));
}

export function getPeranPenguji(
  ujian: Ujian,
  dosenId: number | undefined
): string | null {
  if (!Array.isArray(ujian.penguji) || !dosenId) return null;

  const found = ujian.penguji.find((p) => p.id === Number(dosenId));
  if (!found) return null;

  switch (found.peran) {
    case "ketua_penguji":
      return "Ketua Penguji";
    case "sekretaris_penguji":
      return "Sekretaris Penguji";
    case "penguji_1":
      return "Penguji 1";
    case "penguji_2":
      return "Penguji 2";
    default:
      return found.peran;
  }
}
