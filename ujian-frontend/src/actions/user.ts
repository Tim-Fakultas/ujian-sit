"use server";

export async function getAllUsers() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${apiUrl}/users`, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        return data.data; // Assumption: response format is { data: User[] }
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}
