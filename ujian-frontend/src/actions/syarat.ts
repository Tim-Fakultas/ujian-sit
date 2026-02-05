import { Syarat } from "@/types/Syarat";

export async function getAllSyarat() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;


    try {
        const response = await fetch(`${apiUrl}/syarat`, {
            cache: "no-store",
        });


        if (!response.ok) {
            // Log the error response body
            const errorText = await response.text();
            console.error("[getAllSyarat] Failed to fetch syarat:", response.status, response.statusText, errorText);
            throw new Error(`Failed to fetch all syarat: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Assuming Laravel Resource collection returns { data: [...] }
        const syaratList = data.data as Syarat[];

        return syaratList;
    } catch (error) {
        console.error("[getAllSyarat] Error:", error);
        // Return empty array but log the error
        return [];
    }
}
