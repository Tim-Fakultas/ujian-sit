import { Dosen, DosenResponse } from "@/types/Dosen";

export async function getAllDosen() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/dosen`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all dosen");
    }

    const data: DosenResponse = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
}

export async function getMonitorBimbingan() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/dosen/monitor-bimbingan`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch monitor bimbingan");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching monitor bimbingan:", error);
    return [];
  }
}

export async function getDosenBimbinganDetails(id: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/dosen/${id}/bimbingan`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch details");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error details:", error);
    return null;
  }
}

export async function createDosen(payload: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/dosen`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to create dosen");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating dosen:", error);
    throw error;
  }
}

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
      (dosen) => dosen.prodi.id === prodiId,
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
    no_hp?: string;
    alamat?: string;
    tempat_tanggal_lahir?: string;
    pangkat?: string;
    golongan?: string;
    tmt_fst?: string;
    jabatan?: string;
    foto?: string | null;
  },
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

export async function getDosenByUserId(userId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/dosen?user_id=${userId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch dosen by user id");
    }

    const data: DosenResponse = await response.json();
    // API returns a collection (array) wrapped in data resource, or maybe just array
    // DosenController index returns DosenResource::collection($dosen)
    // If wrapping is 'data', then data.data is the array.
    // Let's assume standard resource structure { data: [...] }
    if (Array.isArray(data.data) && data.data.length > 0) {
      return data.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching dosen by user id:", error);
    return null;
  }
}
