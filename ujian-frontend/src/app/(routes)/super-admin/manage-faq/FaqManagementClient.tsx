"use client";

import { useState } from "react";
import { Faq } from "@/types/Faq";
import { createFaq, updateFaq, deleteFaq } from "@/actions/faq";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { showToast } from "@/components/ui/custom-toast";
import { DataCard } from "@/components/common/DataCard";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface Props {
    initialData: Faq[];
}

export default function FaqManagementClient({ initialData }: Props) {
    const router = useRouter();
    const [faqs, setFaqs] = useState<Faq[]>(initialData);
    const [loading, setLoading] = useState(false);

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Form States
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        is_active: true,
    });

    // Delete State
    const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);

    const handleCreate = () => {
        setEditingFaq(null);
        setFormData({ question: "", answer: "", is_active: true });
        setIsDialogOpen(true);
    };

    const handleEdit = (faq: Faq) => {
        setEditingFaq(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            is_active: faq.is_active,
        });
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (faq: Faq) => {
        setFaqToDelete(faq);
        setIsDeleteDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingFaq) {
                await updateFaq(editingFaq.id, formData);
                showToast.success("FAQ berhasil diperbarui");
            } else {
                await createFaq(formData);
                showToast.success("FAQ berhasil ditambahkan");
            }
            router.refresh();
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
            showToast.error("Gagal menyimpan FAQ");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!faqToDelete) return;
        setLoading(true);
        try {
            await deleteFaq(faqToDelete.id);
            showToast.success("FAQ berhasil dihapus");
            router.refresh();
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error(error);
            showToast.error("Gagal menghapus FAQ");
        } finally {
            setLoading(false);
            setFaqToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Manage FAQ</h2>
                    <p className="text-muted-foreground text-sm">Kelola pertanyaan umum yang sering ditanyakan.</p>
                </div>
                <Button onClick={handleCreate} className="bg-primary text-white hover:bg-primary/90 rounded-2xl">
                    <Plus className="mr-2 h-4 w-4" /> Tambah FAQ
                </Button>
            </div>

            <DataCard>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center">No</TableHead>
                                <TableHead>Pertanyaan</TableHead>
                                <TableHead className="max-w-[300px]">Jawaban</TableHead>
                                <TableHead className="w-[100px] text-center">Status</TableHead>
                                <TableHead className="w-[100px] text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        Belum ada data FAQ.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                initialData.map((faq, index) => (
                                    <TableRow key={faq.id}>
                                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{faq.question}</TableCell>
                                        <TableCell className="text-muted-foreground truncate max-w-[300px]" title={faq.answer}>
                                            {faq.answer}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${faq.is_active
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                }`}>
                                                {faq.is_active ? "Aktif" : "Nonaktif"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(faq)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DataCard>

            {/* Form Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingFaq ? "Edit FAQ" : "Tambah FAQ"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="question">Pertanyaan</Label>
                            <Input
                                id="question"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                placeholder="Masukkan pertanyaan..."
                                required
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="answer">Jawaban</Label>
                            <Textarea
                                id="answer"
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                placeholder="Masukkan jawaban..."
                                required
                                className="min-h-[100px] rounded-xl"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                            />
                            <Label htmlFor="is_active">Status Aktif</Label>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Batal</Button>
                            <Button type="submit" disabled={loading} className="rounded-xl">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus FAQ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. FAQ ini akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                            {loading ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
