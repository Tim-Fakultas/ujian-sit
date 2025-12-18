import { Dosen, DosenResponse } from "@/types/Dosen";

export async function getDosen(prodiId: number | undefined) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/dosen`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dosen");
    }

    const data: DosenResponse = await response.json();
    const filteredData: Dosen[] = data.data.filter(
      (dosen) => dosen.prodi.id === prodiId
    );
    return filteredData;
  } catch (error) {
    console.error("Error fetching dosen:", error);
    return [];
  }
}

export async function updateDosen(
  id: number,
  payload: {
    nama?: string;
    noHp?: string;
    alamat?: string;
    tempatTanggalLahir?: string;
    pangkat?: string;
    golongan?: string;
    tmtFst?: string;
    jabatan?: string;
    foto?: string | null;
  }
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/dosen/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to update dosen");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating dosen:", error);
    return null;
  }
}

export async function deleteDosenById(id: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${apiUrl}/dosen/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to delete dosen");
    }
    return await res.json();
  } catch (error) {
    console.error("Error deleting dosen:", error);
  }
}
