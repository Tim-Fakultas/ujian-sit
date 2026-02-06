import { PendaftaranUjian } from "@/types/PendaftaranUjian";

export async function getTotalJadwalUjian(prodiId?: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/jadwal-ujian?prodiId=${prodiId}`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}

export async function getTotalPendaftaranUjianMenunggu(prodiId?: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${apiUrl}/berita-ujian?prodiId=${prodiId}`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}

export async function getTotalMahasiswa(prodiId?: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/mahasiswa?prodiId=${prodiId}`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}

export async function getTotalDosen(prodiId?: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/dosen?prodiId=${prodiId}`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}

export async function getTotalPengajuanRanpelMenunggu(prodiId?: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/pengajuan-ranpel`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered = data?.data?.filter(
    (item: any) =>
      item.status === "menunggu" &&
      (!prodiId || item.mahasiswa?.prodi?.id === prodiId)
  );
  return filtered?.length ?? 0;
}

export async function getTotalPengajuanRanpelDiterima(prodiId?: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/pengajuan-ranpel`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered = data?.data?.filter(
    (item: any) =>
      item.status === "diterima" &&
      (!prodiId || item.mahasiswa?.prodi?.id === prodiId)
  );
  return filtered?.length ?? 0;
}

export async function getTotalPeminatan() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/peminatan`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}

export async function getTotalProdi() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/prodi`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}
