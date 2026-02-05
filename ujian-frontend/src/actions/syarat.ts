import { Syarat } from "@/types/Syarat";

export async function getAllSyarat() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/syarat`, {
            cache: "no-store",
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[getAllSyarat] Failed to fetch syarat:", response.status, response.statusText, errorText);
            throw new Error(`Failed to fetch all syarat: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const syaratList = data.data as Syarat[];

        return syaratList;
    } catch (error) {
        console.error("[getAllSyarat] Error:", error);
        return [];
    }
}


export async function getSyaratByJenisUjian(jenisUjianId: number) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/syarat?jenis_ujian_id=${jenisUjianId}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[getSyaratByJenisUjian] Failed to fetch syarat:", response.status, response.statusText, errorText);
            throw new Error(`Failed to fetch syarat: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const syaratList = data.data as Syarat[];

        return syaratList;
    } catch (error) {
        console.error("[getSyaratByJenisUjian] Error:", error);
        return [];
    }
}

