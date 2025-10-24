export async function postPenilaian(data: {
  ujianId: number;
  dosenId: number;
  komponenNilai: { komponenId: number; nilai: number }[];
}) {
  // Format sesuai kebutuhan backend
  const payload = {
    data: data.komponenNilai.map((k) => ({
      ujianId: data.ujianId,
      dosenId: data.dosenId,
      komponenPenilaianId: k.komponenId,
      nilai: k.nilai,
    })),
  };
  const response = await fetch("http://localhost:8000/api/penilaian", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    let errorText = "Gagal menyimpan penilaian";
    try {
      const errorData = await response.json();
      if (errorData?.message) errorText += ": " + errorData.message;
      else if (typeof errorData === "string") errorText += ": " + errorData;
    } catch (e) {
      // fallback jika bukan json
      errorText += ": " + response.statusText;
    }
    throw new Error(errorText);
  }
  return response.json();
}
