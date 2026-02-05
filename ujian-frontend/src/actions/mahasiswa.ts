"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function uploadFileAction(formData: FormData) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userCookie = cookieStore.get("user")?.value;

    if (!token || !userCookie) {
        throw new Error("Unauthorized");
    }

    const user = JSON.parse(userCookie);
    const mahasiswaId = user.id;

    try {
        // Laravel requires POST method with _method=PUT to handle file uploads for update routes
        formData.append("_method", "PUT");

        const response = await fetch(`${apiUrl}/mahasiswa/${mahasiswaId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
            cache: "no-store",
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Upload File error response:", text);
            throw new Error(`Upload failed: ${response.status} - ${text}`);
        }

        // revalidatePath("/mahasiswa/profile"); // Removed to prevent page refresh
        return { success: true };
    } catch (error) {
        console.error("Upload File error:", error);
        throw error;
    }
}

// Alias for KTM upload
export const uploadKtmAction = uploadFileAction;

export async function updateMahasiswaProfileAction(data: {
    ipk?: number;
    semester?: number;
    email?: string;
    alamat?: string;
    no_hp?: string;
    nim?: string;
    nama?: string;
    prodi_id?: number;
    peminatan_id?: number;
}) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userCookie = cookieStore.get("user")?.value;

    if (!token || !userCookie) {
        throw new Error("Unauthorized");
    }

    const user = JSON.parse(userCookie);
    const mahasiswaId = user.id;

    // Check if email is being changed
    const shouldSendEmail = data.email && data.email !== user.email;

    const payload: any = {
        ...data,
        noHp: data.no_hp,
        phone: data.no_hp,

        // Address variations
        address: data.alamat,
        alamat_domisili: data.alamat,
        domisili: data.alamat,
        alamatLengkap: data.alamat,
        alamatRumah: data.alamat,
        location: data.alamat,

        // Nested variation 
        user: {
            alamat: data.alamat,
            address: data.alamat,
            no_hp: data.no_hp,
            // Only send email in nested object if it changed
            ...(shouldSendEmail ? { email: data.email } : {}),
        }
    };

    // Only include email in root payload if it changed
    if (!shouldSendEmail) {
        delete payload.email;
    }

    // Explicitly delete prohibited fields if they slipped in via data spread
    delete payload.nim;
    delete payload.nama;
    delete payload.prodi_id;
    delete payload.prodiId;

    try {
        const response = await fetch(`${apiUrl}/mahasiswa/${mahasiswaId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error("Update profile error response:", responseData);

            if (response.status === 422) {
                const errorMessage = responseData.message || "Validasi gagal";
                const errorDetails = responseData.errors ? JSON.stringify(responseData.errors) : "";
                return { success: false, error: `${errorMessage} ${errorDetails}` };
            }

            throw new Error(`Update failed: ${response.status} - ${JSON.stringify(responseData)}`);
        }

        revalidatePath("/mahasiswa/profile");
        return { success: true };
    } catch (error) {
        console.error("Update profile error:", error);
        throw error;
    }
}
