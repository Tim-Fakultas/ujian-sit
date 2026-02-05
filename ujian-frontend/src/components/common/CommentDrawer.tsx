"use client";

import { useState, useEffect, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, CheckCircle2, Trash2 } from "lucide-react";
import { Comment } from "@/types/Comment";
import { getComments, postComment, resolveComment, deleteComment } from "@/actions/comments";
import { showToast } from "@/components/ui/custom-toast";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useAuthStore } from "@/stores/useAuthStore";

interface CommentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    proposalId: number;
    sectionId: string;
    sectionTitle: string;
}

export default function CommentDrawer({
    isOpen,
    onClose,
    proposalId,
    sectionId,
    sectionTitle,
}: CommentDrawerProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const { user } = useAuthStore();

    const fetchComments = useCallback(async () => {
        if (!proposalId || !sectionId) return;
        setLoading(true);
        try {
            const data = await getComments(proposalId, sectionId);
            setComments(data);
        } catch (error) {
            console.error(error);
            // For demo purposes, we might want to not show error if API is missing
            // showToast.error("Gagal memuat komentar");
        } finally {
            setLoading(false);
        }
    }, [proposalId, sectionId]);

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen, fetchComments]);

    const handleSubmit = async () => {
        if (!newMessage.trim()) return;
        setSubmitting(true);
        try {
            await postComment({
                proposalId,
                sectionId,
                message: newMessage,
                userId: user?.id
            });
            setNewMessage("");
            fetchComments();
            showToast.success("Komentar berhasil dikirim");
        } catch (error) {
            console.error(error);
            showToast.error("Gagal mengirim komentar");
        } finally {
            setSubmitting(false);
        }
    };

    const handleResolve = async (commentId: number) => {
        try {
            await resolveComment(commentId);
            fetchComments();
            showToast.success("Komentar ditandai selesai");
        } catch (error) {
            console.error(error);
            // Mock behavior
            setComments(prev => prev.map(c => c.id === commentId ? { ...c, isResolved: true } : c));
        }
    };

    const handleDelete = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            fetchComments();
            showToast.success("Komentar dihapus");
        } catch (error) {
            console.error(error);
            setComments(prev => prev.filter(c => c.id !== commentId));
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-white dark:bg-neutral-900 border-l dark:border-neutral-800 shadow-2xl">
                <SheetHeader className="pb-4 border-b dark:border-neutral-800">
                    <SheetTitle className="text-base font-bold dark:text-gray-100 flex items-center gap-2">
                        Revisi & Komentar
                    </SheetTitle>
                    <SheetDescription className="text-xs truncate">
                        {sectionTitle}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 min-h-0 -mx-6">
                    <ScrollArea className="h-full px-6">
                        <div className="">
                            {loading ? (
                                <div className="flex h-20 items-center justify-center">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm text-center">
                                    <p>Belum ada komentar untuk bagian ini.</p>
                                    {user?.role === "dosen" && (
                                        <p className="text-xs pt-2">Tulis komentar baru di bawah untuk memberikan revisi.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4 p-4">
                                    {comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className={`p-3 rounded-lg border ${comment.isResolved ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30' : 'bg-gray-50 border-gray-100 dark:bg-neutral-800 dark:border-neutral-700'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-primary/10 dark:bg-primary/30 text-primary dark:text-primary flex items-center justify-center text-xs font-bold">
                                                        D
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold dark:text-gray-200">
                                                            {comment.userId === user?.id
                                                                ? "Anda"
                                                                : (comment.user.role === 'dosen' ? "Dosen Pembimbing Akademik" : comment.user.name)
                                                            }
                                                            {(comment.user.role === 'dosen' && comment.userId !== user?.id) && <span className="ml-1 text-[10px] bg-primary/10 text-primary px-1 py-0.5 rounded">Dosen</span>}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: id })}
                                                        </span>
                                                    </div>
                                                </div>

                                                {(!comment.isResolved && user?.role === 'dosen') && (
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-6 w-6 text-gray-400 hover:text-red-500"
                                                            onClick={() => handleDelete(comment.id)}
                                                        >
                                                            <Trash2 size={12} />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-6 px-2 text-[10px] text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => handleResolve(comment.id)}
                                                        >
                                                            <CheckCircle2 size={12} className="mr-1" />
                                                            Selesai
                                                        </Button>
                                                    </div>
                                                )}
                                                {comment.isResolved && (
                                                    <span className="text-[10px] font-medium text-green-600 flex items-center bg-green-100 px-2 py-0.5 rounded-full dark:bg-green-900/40 dark:text-green-400">
                                                        <CheckCircle2 size={10} className="mr-1" /> Resolved
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line pl-8">
                                                {comment.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {user?.role === "dosen" ? (
                    <div className="pt-4 mt-auto border-t dark:border-neutral-800">
                        <div className="relative">
                            <Textarea
                                placeholder="Tulis revisi atau komentar..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                className="pr-12 min-h-[80px] text-sm dark:bg-neutral-800"
                            />
                            <Button
                                size="icon"
                                className="absolute bottom-2 right-2 h-8 w-8 rounded-full"
                                onClick={handleSubmit}
                                disabled={submitting || !newMessage.trim()}
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={14} />}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="pt-4 mt-auto border-t dark:border-neutral-800 text-center text-xs text-muted-foreground p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-lg m-4">
                        Mode lihat-saja. Anda tidak memiliki akses untuk memberikan revisi.
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
