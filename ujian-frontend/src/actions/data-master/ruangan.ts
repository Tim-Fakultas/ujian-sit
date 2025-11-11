export async function getRuangan() {
  try {
    const res = await fetch("http://localhost:8000/api/ruangan", {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 },
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
