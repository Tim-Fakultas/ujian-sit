"use server";
export async function setHadirUjian(dosenId: number, ujianId: number) {
  const res = await fetch(`http://localhost:8000/api/daftar-kehadiran`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dosenId,
      ujianId,
      status: "hadir",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to set hadir ujian");
  }

  return res.json();
}
