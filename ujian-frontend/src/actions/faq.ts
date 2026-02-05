"use server";

import { Faq } from "@/types/Faq";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getFaqs() {
    try {
        const res = await fetch(`${API_URL}/faqs`, {
            cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        const json = await res.json();
        return json.data as Faq[];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createFaq(data: { question: string; answer: string; is_active: boolean }) {
    try {
        const res = await fetch(`${API_URL}/faqs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to create FAQ");

        const json = await res.json();
        revalidatePath("/super-admin/manage-faq");
        return json.data;
    } catch (error) {
        throw error;
    }
}

export async function updateFaq(id: number, data: { question: string; answer: string; is_active: boolean }) {
    try {
        const res = await fetch(`${API_URL}/faqs/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to update FAQ");

        const json = await res.json();
        revalidatePath("/super-admin/manage-faq");
        return json.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteFaq(id: number) {
    try {
        const res = await fetch(`${API_URL}/faqs/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete FAQ");

        revalidatePath("/admin/manage-faq");
        return true;
    } catch (error) {
        throw error;
    }
}
