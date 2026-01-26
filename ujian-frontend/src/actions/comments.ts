"use server";

import { Comment, CreateCommentPayload } from "@/types/Comment";
import { revalidatePath } from "next/cache";

export async function getComments(proposalId: number, sectionId: string): Promise<Comment[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const res = await fetch(`${apiUrl}/comments?proposal_id=${proposalId}&section_id=${sectionId}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            return [];
        }

        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}

export async function postComment(payload: CreateCommentPayload) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const res = await fetch(`${apiUrl}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error("Failed to post comment: " + text);
        }

        revalidatePath("/dosen/penilaian-ujian");
        revalidatePath("/mahasiswa/pengajuan-ranpel");
        return await res.json();
    } catch (error) {
        console.error("Error posting comment:", error);
        throw error;
    }
}

export async function resolveComment(commentId: number) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const res = await fetch(`${apiUrl}/comments/${commentId}/resolve`, {
            method: "PATCH",
        });

        if (!res.ok) {
            throw new Error("Failed to resolve comment");
        }

        revalidatePath("/dosen/penilaian-ujian");
        return await res.json();
    } catch (error) {
        console.error("Error resolving comment:", error);
        throw error;
    }
}

export async function deleteComment(commentId: number) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const res = await fetch(`${apiUrl}/comments/${commentId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            throw new Error("Failed to delete comment");
        }

        revalidatePath("/dosen/penilaian-ujian");
        return await res.json();
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
}
