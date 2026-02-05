"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, Loader2, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import { uploadFileAction } from "@/actions/mahasiswa";
import { showToast } from "@/components/ui/custom-toast";
import { refreshUserAction } from "@/actions/auth";

interface Props {
    title: string;
    description?: string;
    currentUrl?: string;
    fileKey: string; // The key used in FormData (e.g., 'file_ktm', 'file_transkrip_nilai')
    accept?: string;
}

import { getStorageUrl } from "@/lib/utils";

export default function FileUploadCard({
    title,
    description,
    currentUrl,
    fileKey,
    accept = "image/*,application/pdf"
}: Props) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(currentUrl);
    const router = useRouter();

    // Sync uploadedUrl with currentUrl when prop changes (e.g., dialog reopens)
    useEffect(() => {
        setUploadedUrl(currentUrl);
    }, [currentUrl]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size/type
        if (file.size > 5 * 1024 * 1024) {
            showToast.error("Ukuran file maksimal 5MB");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append(fileKey, file);

        try {
            await uploadFileAction(formData);
            showToast.success(`Berhasil mengunggah ${title}`);
            // Mark as uploaded locally to update UI immediately
            // User data will be refreshed when the form is submitted or dialog is reopened
            setUploadedUrl("uploaded"); // Placeholder to indicate file is uploaded
        } catch (error) {
            showToast.error(`Gagal mengunggah ${title}`);
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
                    {title}
                </h3>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Preview / Status */}
                    <div className="flex-1 w-full">
                        {uploadedUrl ? (
                            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-primary text-sm">Valid</div>
                                        <div className="text-xs text-muted-foreground">Dokumen Tersedia</div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="h-9 border-primary/20 hover:bg-primary/10 text-primary"
                                >
                                    <a href={getStorageUrl(uploadedUrl)} target="_blank" rel="noreferrer">
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
                                    <div className="text-xs text-yellow-600/80 dark:text-yellow-500/80">Silakan unggah dokumen</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upload Action */}
                    <div className="shrink-0 w-full sm:w-auto">
                        <input
                            type="file"
                            id={`upload-${fileKey}`}
                            className="hidden"
                            accept={accept}
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <label htmlFor={`upload-${fileKey}`}>
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
                                    {isUploading ? "Mengunggah..." : (uploadedUrl ? "Perbarui" : "Unggah")}
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
