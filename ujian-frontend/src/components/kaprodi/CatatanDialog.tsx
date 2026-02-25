"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareText, Edit, Save, X, Loader2 } from "lucide-react";
// import { updateStatusPengajuanRanpel } from "@/actions/pengajuanRanpel"; // No longer needed
import { updateCatatanKaprodi } from "@/actions/kaprodi";
import { showToast } from "@/components/ui/custom-toast";
import { useRouter } from "next/navigation";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";

interface CatatanDialogProps {
  pengajuan: PengajuanRanpel;
}

export default function CatatanDialog({ pengajuan }: CatatanDialogProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [catatanKaprodi, setCatatanKaprodi] = useState(
    pengajuan.catatanKaprodi || "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const catDosen = pengajuan.keterangan;
  const initialCatatanKaprodi = pengajuan.catatanKaprodi;
  const hasDosen = catDosen && catDosen !== "-" && catDosen.trim() !== "";
  // We determine hasKaprodi based on the actual value for display, but for editing we alway allow if editing.
  const hasKaprodi =
    initialCatatanKaprodi &&
    initialCatatanKaprodi !== "-" &&
    initialCatatanKaprodi.trim() !== "";

  const handleSave = async () => {
    if (!pengajuan.mahasiswa?.id || !pengajuan.id) return;

    setIsSaving(true);
    try {
      // Using logic dedicated for Kaprodi
      const res = await updateCatatanKaprodi(pengajuan.id, catatanKaprodi);

      if (res) {
        showToast.success("Catatan Kaprodi berhasil diperbarui");
        setIsEditing(false);
        router.refresh(); // Refresh server data
      } else {
        // If no data returned but no error thrown
        showToast.info(
          "Catatan diperbarui (silakan refresh jika belum tampil)",
        );
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
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setIsEditing(false);
          setCatatanKaprodi(pengajuan.catatanKaprodi || "");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 rounded-full ${!hasDosen && !hasKaprodi ? "text-gray-400 hover:text-primary bg-gray-50 hover:bg-primary/10" : "text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary"}`}
        >
          <MessageSquareText size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border">
        <DialogHeader className="px-6 py-4 bg-slate-50 dark:bg-neutral-900 border-b">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <MessageSquareText size={18} />
            <DialogTitle className="text-lg font-bold">
              Catatan Peninjauan
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 bg-white dark:bg-neutral-950">
          <div className="space-y-6">
            {/* Notes from Dosen PA (Read Only) */}
            {hasDosen && (
              <div className="space-y-2">
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-emerald-600">
                  CATATAN DOSEN PA
                </h4>
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                  {catDosen}
                </div>
              </div>
            )}

            {/* Notes from Kaprodi (Editable) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-indigo-600">
                  CATATAN KAPRODI
                </h4>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-7 px-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50"
                  >
                    <Edit size={12} className="mr-1" /> Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <Textarea
                    value={catatanKaprodi}
                    onChange={(e) => setCatatanKaprodi(e.target.value)}
                    placeholder="Tulis catatan atau revisi..."
                    className="min-h-[120px] text-sm bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 rounded-lg p-3 font-medium focus:border-indigo-500"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="h-8 text-xs font-bold px-3"
                    >
                      Batal
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="h-8 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4"
                    >
                      {isSaving ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                      ) : (
                        <Save size={14} className="mr-2" />
                      )}
                      Simpan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-slate-200 dark:border-neutral-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300 min-h-[60px] font-medium">
                  {hasKaprodi ? (
                    pengajuan.catatanKaprodi
                  ) : (
                    <span className="text-slate-400 italic text-xs">
                      Belum ada catatan.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
