"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, X, Info, RefreshCw } from "lucide-react";

export function CookieWarning() {
  const [open, setOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    // Tampilkan popup otomatis setiap kali halaman login dibuka
    // Agar user yang mengalami masalah langsung melihat opsi bantuan ini
    setOpen(true);
  }, []);

  const handleClearData = () => {
    setClearing(true);
    if (typeof window !== "undefined") {
      // 1. Hapus Local Storage (Hanya berlaku untuk domain web ini, aman dari web lain)
      localStorage.clear();

      // 2. Hapus Session Storage (Hanya berlaku untuk tab/sesi ini)
      sessionStorage.clear();

      // 3. Hapus Cookies (Hanya cookies yang bisa diakses oleh domain ini)
      // Browser secara otomatis membatasi akses script hanya ke cookies domain sendiri (Same-Origin Policy).
      // Web ini TIDAK BISA menghapus cookies milik website lain (seperti Google, Facebook, dll).
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Simulasi loading sebentar agar user 'merasa' ada proses
      setTimeout(() => {
        setClearing(false);
        setOpen(false);
        // Reload halaman agar bersih total
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-500 dark:hover:text-amber-400 dark:hover:bg-amber-900/20 transition-all px-4 font-semibold"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Masalah Login?</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-[90%] sm:w-full sm:max-w-md rounded-[2rem] p-0 gap-0 bg-white dark:bg-zinc-950 border-none shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

        <DialogHeader className="p-8 pb-4 relative overflow-hidden text-left">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                  Troubleshooting
                </span>
              </div>
              <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-100/50 rounded-2xl dark:bg-amber-900/20">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                Kendala Login
              </DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                Jika Anda mengalami masalah saat login atau data tidak muncul,
                coba langkah berikut.
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 border border-zinc-100 dark:border-zinc-800 rounded-full bg-zinc-50/50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all hover:scale-105"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="px-8 pb-8 pt-2 space-y-6">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex gap-4 items-start">
            <Info className="h-5 w-5 text-zinc-400 shrink-0 mt-0.5" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Terkadang browser menyimpan data kadaluarsa (cache/cookies) yang
              menyebabkan konflik saat login. Menghapus data ini seringkali
              menjadi solusi ampuh.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleClearData}
                disabled={clearing}
                className="w-full h-12 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]"
              >
                {clearing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Membersihkan...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus Cookies & Data (Web Ini Saja)
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full h-11 rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 active:scale-[0.98]"
              >
                Batal, Saya Coba Login Lagi
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
