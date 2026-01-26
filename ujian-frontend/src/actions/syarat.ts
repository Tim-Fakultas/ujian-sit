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
            console.error("Failed to fetch syarat:", response.status, response.statusText, errorText);
            throw new Error("Failed to fetch all syarat");
        }

        const data = await response.json();
        // Assuming Laravel Resource collection returns { data: [...] }
        return data.data as Syarat[];
    } catch (error) {
        console.error("Error in getAllSyarat:", error);
        return [];
    }
}
