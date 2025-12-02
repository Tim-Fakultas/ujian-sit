import { PendaftaranUjian } from "@/types/PendaftaranUjian";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export async function getTotalJadwalUjian(prodiId?: number) {
  const res = await fetch(`${apiUrl}/jadwal-ujian?prodiId=${prodiId}`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}

export async function getTotalPendaftaranUjianMenunggu(prodiId?: number) {
  const res = await fetch(`${apiUrl}/pendaftaran-ujian`, {
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
  const res = await fetch(`${apiUrl}/berita-ujian?prodiId=${prodiId}`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}
