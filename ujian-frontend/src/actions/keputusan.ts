"use server";

export async function postKeputusanByUjianId(
  ujianId: number | null,
  keputusanId: number
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/ujian/${ujianId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keputusanId }),
    });
    if (!res.ok) {
      throw new Error("Failed to post keputusan");
    }
    return await res.json();
  } catch (error) {
    console.error("Error posting keputusan:", error);
  }
}
