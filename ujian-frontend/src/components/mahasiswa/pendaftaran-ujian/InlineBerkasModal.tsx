"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Eye, UploadCloud, X, Loader2, RefreshCw, Check } from "lucide-react";
import { getStorageUrl } from "@/lib/utils";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import { showToast } from "@/components/ui/custom-toast";
import { updatePendaftaranUjianWithBerkas } from "@/actions/pendaftaranUjian";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface InlineBerkasModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pendaftaran: PendaftaranUjian | null;
    mahasiswaId: number;
}

export default function InlineBerkasModal({
    open,
    onOpenChange,
    pendaftaran,
    mahasiswaId,
}: InlineBerkasModalProps) {
    const [replacingBerkasId, setReplacingBerkasId] = useState<number | null>(null);
    const [berkasList, setBerkasList] = useState<any[]>([]); // Local state for immediate updates
    const router = useRouter();

    // Sync input prop with local state when modal opens or prop changes
    useEffect(() => {
        if (pendaftaran?.berkas) {
            setBerkasList(pendaftaran.berkas);
        }
    }, [pendaftaran]);

    if (!pendaftaran) return null;
    if (!open) return null;

    const canEdit = pendaftaran.status === "revisi";

    const handleReplaceFile = async (berkasId: number, file: File) => {
        if (!file || !pendaftaran) return;

        setReplacingBerkasId(berkasId);
        try {
            const formData = new FormData();
            formData.append("berkas[]", file);
            formData.append("replace_berkas_id", berkasId.toString());

            // Optimistic update or wait for response? Let's wait for response to be safe but update local state immediately after
            // The API response actually returns the updated PendaftaranUjianResource usually, 
            // but updatePendaftaranUjianWithBerkas action might currently just return the axios response.
            // Let's assume success and update local UI.

            const response = await updatePendaftaranUjianWithBerkas(mahasiswaId, pendaftaran.id, formData);

            if (response && response.data && response.data.berkas) {
                setBerkasList(response.data.berkas);
            }

            showToast.success("Berkas berhasil diperbarui");
            router.refresh(); // Sync server data in background
        } catch (error) {
            console.error(error);
            showToast.error("Gagal memperbarui berkas");
        } finally {
            setReplacingBerkasId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in-0">
            <div className="relative w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-xl bg-background shadow-lg border animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-start justify-between p-4 sm:p-6 border-b sticky top-0 bg-background z-10">
                    <div className="flex-1 pr-2">
                        <h2 className="text-base sm:text-lg font-semibold cursor-default">Berkas Pengajuan</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                            {pendaftaran.judulPenelitian}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full flex-shrink-0"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Info Jenis Ujian */}
                    <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg border border-dashed">
                        <div className="bg-primary/10 p-2 rounded-md text-primary flex-shrink-0">
                            <FileText size={18} />
                        </div>
                        <div className="text-xs sm:text-sm min-w-0">
                            <span className="text-muted-foreground mr-1">Jenis Ujian:</span>
                            <span className="font-medium break-words">{pendaftaran.jenisUjian.namaJenis}</span>
                        </div>
                    </div>

                    {/* Revisi Note */}
                    {pendaftaran.status === "revisi" && pendaftaran.keterangan && (
                        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 sm:p-4">
                            <h3 className="text-xs sm:text-sm font-semibold text-orange-800 dark:text-orange-400 mb-1 flex items-center gap-2">
                                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                Catatan Revisi
                            </h3>
                            <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300/90 leading-relaxed">
                                {pendaftaran.keterangan}
                            </p>
                        </div>
                    )}

                    {/* Berkas List */}
                    <div>
                        <h3 className="font-medium mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">
                            Daftar Dokumen
                        </h3>

                        {berkasList.length === 0 ? (
                            <div className="text-center py-8 sm:py-12 bg-muted/20 rounded-xl border border-dashed">
                                <p className="text-muted-foreground text-xs sm:text-sm">Tidak ada berkas yang diunggah.</p>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:gap-4">
                                {berkasList.map((item, idx) => (
                                    <div key={idx} className="border rounded-xl p-3 sm:p-5 bg-card hover:shadow-sm transition-shadow space-y-3 sm:space-y-4">
                                        <div className="flex items-start justify-between gap-3 sm:gap-4">
                                            <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-2.5 rounded-lg text-blue-600 dark:text-blue-400 flex-shrink-0">
                                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-medium text-xs sm:text-sm md:text-base break-words">{item.namaBerkas || "Dokumen"}</h4>
                                                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 break-words">
                                                        Diunggah pada {item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString("id-ID", {
                                                            day: 'numeric', month: 'long', year: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        }) : "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2 border-t border-dashed">
                                            {/* Status Badge */}
                                            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 rounded-lg border border-green-100 dark:border-green-800">
                                                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                <span className="text-[10px] sm:text-xs font-medium">Valid & Tersedia</span>
                                            </div>

                                            <div className="flex items-center gap-2 sm:ml-auto">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 sm:h-9 text-[10px] sm:text-xs flex-1 sm:flex-none"
                                                    asChild
                                                >
                                                    <a
                                                        href={getStorageUrl(item.filePath)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="Lihat Berkas"
                                                    >
                                                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" />
                                                        Lihat
                                                    </a>
                                                </Button>

                                                {canEdit && item.id && (
                                                    <>
                                                        <Input
                                                            type="file"
                                                            id={`file-${item.id}`}
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0] || null;
                                                                if (item.id && file) {
                                                                    handleReplaceFile(item.id, file);
                                                                }
                                                            }}
                                                        />
                                                        <Button
                                                            size="sm"
                                                            className="h-8 sm:h-9 text-[10px] sm:text-xs bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                                                            onClick={() => document.getElementById(`file-${item.id}`)?.click()}
                                                            disabled={replacingBerkasId === item.id}
                                                        >
                                                            {replacingBerkasId === item.id ? (
                                                                <Loader2 className="animate-spin h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" />
                                                            ) : (
                                                                <UploadCloud className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" />
                                                            )}
                                                            {replacingBerkasId === item.id ? "Memperbarui..." : "Perbarui"}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
