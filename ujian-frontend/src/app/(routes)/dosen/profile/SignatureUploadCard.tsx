"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { uploadDosenSignatureAction } from "@/actions/dosen";
import { showToast } from "@/components/ui/custom-toast";
import { getStorageUrl } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  currentUrl?: string; // URL of existing signature if any
  fileKey?: string; // Default to 'ttd'
  accept?: string;
}

export default function SignatureUploadCard({
  title,
  description,
  currentUrl,
  fileKey = "ttd",
  accept = "image/png,image/jpeg,image/jpg",
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size/type
    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit for signature seems reasonable
      showToast.error("Ukuran file maksimal 2MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append(fileKey, file);

    try {
      await uploadDosenSignatureAction(formData);
      showToast.success(`Berhasil mengunggah ${title}`);

      // Update client store (localStorage)
      try {
        const { useAuthStore } = await import("@/stores/useAuthStore");
        await useAuthStore.getState().refreshUser();
      } catch (e) {
        console.error("Failed to refresh client store:", e);
      }

      router.refresh();
    } catch (error) {
      showToast.error(`Gagal mengunggah ${title}`);
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-neutral-800 flex flex-row items-center gap-3 p-6">
        <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Preview / Status */}
          <div className="w-full">
            {currentUrl ? (
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50 dark:bg-blue-900/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg text-primary">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-primary dark:text-blue-400 text-sm">
                      Tersedia
                    </div>
                    <div className="text-xs text-primary/80">
                      Tanda tangan aktif
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-9 border-blue-200 hover:bg-blue-100 text-primary"
                >
                  <a
                    href={getStorageUrl(currentUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Eye size={16} className="mr-2" />
                    Lihat
                  </a>
                </Button>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 flex items-center gap-3 w-full">
                <div className="bg-yellow-100 dark:bg-yellow-900/40 p-2 rounded-lg text-yellow-600 dark:text-yellow-400 shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-yellow-700 dark:text-yellow-400 text-sm truncate">
                    Belum Ada
                  </div>
                  <div className="text-xs text-yellow-600/80 dark:text-yellow-500/80 truncate">
                    Silakan unggah tanda tangan Anda untuk keperluan dokumen
                    digital.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upload Action */}
          <div className="w-full">
            <input
              type="file"
              id={`upload-${fileKey}`}
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <label htmlFor={`upload-${fileKey}`} className="block w-full">
              <div
                className={`w-full cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-200 dark:shadow-none rounded-xl py-2.5 flex items-center justify-center transition-colors ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isUploading ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <UploadCloud className="mr-2" size={18} />
                )}
                <span className="font-medium text-sm">
                  {isUploading
                    ? "Mengunggah..."
                    : currentUrl
                      ? "Ganti Tanda Tangan"
                      : "Unggah Tanda Tangan"}
                </span>
              </div>
            </label>
            <p className="text-[10px] text-center mt-2 text-muted-foreground">
              Max 2MB (PNG/JPG)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
