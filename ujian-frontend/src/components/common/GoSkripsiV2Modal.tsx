"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";

export function GoSkripsiV2Modal() {
    return (
        <Dialog open={true}>
            <DialogContent 
                showCloseButton={false} 
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="max-w-[400px] w-[90%] rounded-[2.5rem] p-10 border-none bg-white dark:bg-zinc-950 shadow-2xl flex flex-col items-center text-center gap-8 outline-none"
            >
                {/* Minimalist Icon */}
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150" />
                    <div className="relative w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <GraduationCap className="w-10 h-10" />
                    </div>
                </div>

                <div className="space-y-2">
                    <DialogTitle className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                        GoSkripsi Versi 2
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed font-medium">
                        Sistem telah diperbarui. Silakan gunakan versi terbaru untuk melanjutkan.
                    </DialogDescription>
                </div>

                <div className="w-full space-y-4">
                    <Button 
                        asChild
                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 group transition-all active:scale-[0.98] border-none"
                    >
                        <a href="https://goskripsi.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                            Buka Sekarang
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
                        </a>
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 py-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                            Sistem Siap Digunakan
                        </span>
                    </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 w-full">
                    <p className="text-[10px] text-zinc-300 dark:text-zinc-600 font-bold uppercase tracking-widest">
                        UIN Raden Fatah Palembang
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
