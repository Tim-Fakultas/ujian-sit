"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareText, Edit, Save, X, Loader2 } from "lucide-react";
import { updateStatusPengajuanRanpel } from "@/actions/pengajuanRanpel";
import { showToast } from "@/components/ui/custom-toast";
import { useRouter } from "next/navigation";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";

interface CatatanDialogProps {
    pengajuan: PengajuanRanpel;
}

export default function CatatanDialog({ pengajuan }: CatatanDialogProps) {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [catatanKaprodi, setCatatanKaprodi] = useState(pengajuan.catatanKaprodi || "");
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const catDosen = pengajuan.keterangan;
    const initialCatatanKaprodi = pengajuan.catatanKaprodi;
    const hasDosen = catDosen && catDosen !== "-" && catDosen.trim() !== "";
    // We determine hasKaprodi based on the actual value for display, but for editing we alway allow if editing.
    const hasKaprodi = initialCatatanKaprodi && initialCatatanKaprodi !== "-" && initialCatatanKaprodi.trim() !== "";

    const handleSave = async () => {
        if (!pengajuan.mahasiswa?.id || !pengajuan.id) return;

        setIsSaving(true);
        try {
            // Need to preserve the current status.
            // The updateStatusPengajuanRanpel might require 'status'.
            // Based on previous analysis, it sends status and date updates if status is passed.
            // We'll pass the current status to avoid changing it.

            const res = await updateStatusPengajuanRanpel(
                pengajuan.mahasiswa.id,
                pengajuan.id,
                {
                    status: pengajuan.status, // Preserve valid status
                    catatanKaprodi: catatanKaprodi,
                    skipDateUpdate: true
                }
            );

            if (res && res.data) {
                showToast.success("Catatan Kaprodi berhasil diperbarui");
                setIsEditing(false);
                router.refresh(); // Refresh server data
            } else {
                // If no data returned but no error thrown
                showToast.info("Catatan diperbarui (silakan refresh jika belum tampil)");
                setIsEditing(false);
                router.refresh();
            }

        } catch (error) {
            console.error(error);
            showToast.error("Gagal memperbarui catatan");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setCatatanKaprodi(pengajuan.catatanKaprodi || "");
        setIsEditing(false);
    };

    // If no notes at all and not editing, we might want to show "-" outside functionality.
    // But this component replaces the button trigger logic.
    // The parent component logic for displaying "-" vs button should probably stay there or be moved here completely.
    // Let's assume this component is used when we want to show the dialog button. 
    // If we want to allow Kaprodi to ADD a note even if none exists, we should always show the button for Kaprodi.
    // The previous logic was: if (!hasDosen && !hasKaprodi) return "-";
    // But now since we want to add an edit button, we should probably allow opening the dialog to ADD a note too.
    // However, I will stick to the props passed and render the button.

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) {
                setIsEditing(false);
                setCatatanKaprodi(pengajuan.catatanKaprodi || "");
            }
        }}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full ${(!hasDosen && !hasKaprodi) ? "text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50" : "text-blue-600 bg-blue-50/50 hover:bg-blue-100 hover:text-blue-700"}`}
                >
                    <MessageSquareText size={15} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>Catatan</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Notes from Dosen PA (Read Only) */}
                    {hasDosen && (
                        <div>
                            <h4 className="font-semibold mb-1.5 text-xs uppercase tracking-wider text-blue-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                Dosen PA
                            </h4>
                            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                {catDosen}
                            </div>
                        </div>
                    )}

                    {/* Notes from Kaprodi (Editable) */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <h4 className="font-semibold text-xs uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                                Kaprodi
                            </h4>
                            {!isEditing && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                    className="h-6 px-2 text-xs text-muted-foreground hover:text-indigo-600"
                                >
                                    <Edit size={12} className="mr-1" /> Edit
                                </Button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="space-y-2">
                                <Textarea
                                    value={catatanKaprodi}
                                    onChange={(e) => setCatatanKaprodi(e.target.value)}
                                    placeholder="Tulis catatan untuk mahasiswa..."
                                    className="min-h-[100px] text-sm bg-white dark:bg-neutral-900"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="h-8 text-xs"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {isSaving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
                                        Simpan
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border text-sm leading-relaxed text-gray-700 dark:text-gray-300 min-h-[60px] relative group">
                                {hasKaprodi ? pengajuan.catatanKaprodi : <span className="text-muted-foreground italic text-xs">Belum ada catatan.</span>}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
