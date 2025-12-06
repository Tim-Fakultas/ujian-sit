"use server";
export async function setHadirUjian(dosenId: number, ujianId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/daftar-hadir`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ujianId,
      dosenId,
      statusKehadiran: "hadir",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to set hadir ujian");
  }

  return res.json();
}

export async function getHadirUjian() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${apiUrl}/daftar-hadir`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to get hadir ujian");

  const { data } = await res.json();
  return data; //
}
