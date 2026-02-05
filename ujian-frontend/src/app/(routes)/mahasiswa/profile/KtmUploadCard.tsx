"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, Loader2, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import { uploadKtmAction } from "@/actions/mahasiswa";
import { showToast } from "@/components/ui/custom-toast";
import { refreshUserAction } from "@/actions/auth";

interface Props {
    currentUrl?: string;
}

export default function KtmUploadCard({ currentUrl }: Props) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size/type if needed
        if (file.size > 5 * 1024 * 1024) {
            showToast.error("Ukuran file maksimal 5MB");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file_ktm", file); // Must match backend 'file_ktm'

        try {
            await uploadKtmAction(formData);
            showToast.success("Berhasil mengunggah KTM");
            await refreshUserAction(); // Refresh cookie so if we navigate elsewhere it's updated
        } catch (error) {
            showToast.error("Gagal mengunggah KTM");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="border-0 shadow-md bg-white dark:bg-neutral-900 rounded-2xl">
            <CardHeader className="pb-2 border-b border-gray-100 dark:border-neutral-800">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <FileText className="text-primary" size={20} />
                    Kartu Tanda Mahasiswa (KTM)
                </h3>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Preview / Status */}
                    <div className="flex-1 w-full">
                        {currentUrl ? (
                            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-primary text-sm">Valid</div>
                                        <div className="text-xs text-muted-foreground">KTM Tersedia</div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="h-9 border-primary/20 hover:bg-primary/10 text-primary"
                                >
                                    <a href={currentUrl} target="_blank" rel="noreferrer">
                                        <Eye size={16} className="mr-2" />
                                        Lihat
                                    </a>
                                </Button>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 flex items-center gap-3">
                                <div className="bg-yellow-100 dark:bg-yellow-900/40 p-2 rounded-lg text-yellow-600 dark:text-yellow-400">
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <div className="font-semibold text-yellow-700 dark:text-yellow-400 text-sm">Belum Ada</div>
                                    <div className="text-xs text-yellow-600/80 dark:text-yellow-500/80">Silakan unggah KTM Anda</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upload Action */}
                    <div className="shrink-0 w-full sm:w-auto">
                        <input
                            type="file"
                            id="ktm-upload"
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <label htmlFor="ktm-upload">
                            <Button
                                asChild
                                disabled={isUploading}
                                className="w-full sm:w-auto cursor-pointer bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl"
                            >
                                <span>
                                    {isUploading ? (
                                        <Loader2 className="animate-spin mr-2" size={18} />
                                    ) : (
                                        <UploadCloud className="mr-2" size={18} />
                                    )}
                                    {isUploading ? "Mengunggah..." : (currentUrl ? "Perbarui KTM" : "Unggah KTM")}
                                </span>
                            </Button>
                        </label>
                        <p className="text-[10px] text-center mt-2 text-muted-foreground">
                            Max 5MB (PDF/JPG/PNG)
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
