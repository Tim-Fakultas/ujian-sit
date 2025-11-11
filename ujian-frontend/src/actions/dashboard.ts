import { PendaftaranUjian } from "@/types/PendaftaranUjian";

// Dummy fetchers, replace with actual API calls if available
export async function getTotalJadwalUjian(prodiId?: number) {
  const res = await fetch(
    `http://localhost:8000/api/jadwal-ujian?prodiId=${prodiId}`,
    { cache: "no-store" }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}

export async function getTotalPendaftaranUjianMenunggu(prodiId?: number) {
  const res = await fetch(`http://localhost:8000/api/pendaftaran-ujian`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  const filteredData = data?.data?.filter(
    (p: PendaftaranUjian) =>
      p.mahasiswa.prodiId?.id === prodiId &&
      p.status?.toLowerCase() === "menunggu"
  );
  return filteredData.length ?? 0;
}

export async function getTotalBeritaUjian(prodiId?: number) {
  const res = await fetch(
    `http://localhost:8000/api/berita-ujian?prodiId=${prodiId}`,
    { cache: "no-store" }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}
