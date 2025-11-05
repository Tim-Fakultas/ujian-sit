"use server";
export async function setHadirUjian(dosenId: number, ujianId: number) {
  const res = await fetch(`http://localhost:8000/api/daftar-hadir`, {
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
  const res = await fetch("http://localhost:8000/api/daftar-hadir", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to get hadir ujian");

  const { data } = await res.json();
  return data; //
}
