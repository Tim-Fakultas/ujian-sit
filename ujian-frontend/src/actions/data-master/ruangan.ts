export async function getRuangan() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/ruangan`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Gagal fetch ruangan:", text);
      throw new Error(text);
    }
    const result = await res.json();
    return result;
  } catch (err) {
    console.error("💥 Error getRuangan:", err);
    throw err;
  }
}
