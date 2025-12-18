"use server";

export async function perbaikanJudul(formData: FormData) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    try {
        const response = await fetch(`${apiUrl}/perbaikan-judul/`, {
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
            console.error("Failed to parse JSON response:", text.substring(0, 200)); 
            throw new Error(`Invalid JSON response: ${text.substring(0, 50)}...`);
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
