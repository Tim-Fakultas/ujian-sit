"use server";

import { PerbaikanJudul, PerbaikanJudulResponse } from "@/types/PerbaikanJudul";

export async function perbaikanJudul(formData: FormData) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/perbaikan-judul`, {
            method: "POST",
            body: formData,
            cache: "no-store",
            headers: {
                "Accept": "application/json",
            }
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (error) {
            console.error("Failed to parse JSON response from perbaikan-judul:", text.substring(0, 500));
            throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
        }

        if (!response.ok) {
            throw new Error(data.message || `Failed to update perbaikan judul: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        console.error("Error updating perbaikan judul:", error);
        throw error;
    }
}


export async function getPerbaikanJudulByProdi(prodiId: number) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/perbaikan-judul/`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Accept": "application/json",
            }
        });

        const data: PerbaikanJudulResponse = await response.json();
        const filteredData: PerbaikanJudul[] = data.data.filter((item: PerbaikanJudul) => item.mahasiswa.prodi.id === prodiId);

        return filteredData;
    } catch (error) {
        console.error("Error updating perbaikan judul:", error);
        throw error;
    }
}

export async function getPerbaikanJudulByMahasiswa(mahasiswaId: number) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/mahasiswa/${mahasiswaId}/perbaikan-judul`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Accept": "application/json",
            }
        });

        if (!response.ok) {
            return [];
        }

        const data: PerbaikanJudulResponse = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching perbaikan judul by mahasiswa:", error);
        return [];
    }
}

export async function getPerbaikanJudulByDosen(dosenId: number) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/dosen/${dosenId}/perbaikan-judul`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Accept": "application/json",
            }
        });

        if (!response.ok) {
            return [];
        }

        const data: PerbaikanJudulResponse = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching perbaikan judul by dosen:", error);
        return [];
    }
}


export async function updateStatusPerbaikanJudul(id: number, status: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/perbaikan-judul/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            cache: "no-store"
        });

        const data: PerbaikanJudulResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating perbaikan judul:", error);
        throw error;
    }
}