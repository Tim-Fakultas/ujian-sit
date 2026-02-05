"use client";

import { useState, useEffect } from "react";
import { getFaqs } from "@/actions/faq";
import { Faq } from "@/types/Faq";
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
import { HelpCircle, ChevronDown, Loader2, X, MessageCircle, ArrowRight, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function FaqModal() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchFaqs = async () => {
                setLoading(true);
                try {
                    const data = await getFaqs();
                    setFaqs(data.filter(f => f.is_active));
                } catch (error) {
                    console.error("Failed to fetch FAQs", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchFaqs();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-zinc-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all rounded-full px-4">
                    <HelpCircle className="h-4 w-4" />
                    <span>Bantuan & FAQ</span>
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="w-[95%] sm:w-full sm:max-w-2xl max-h-[85vh] rounded-3xl flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-950 border-none shadow-2xl">
                {/* Visual Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

                <DialogHeader className="p-8 pb-4 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex items-start justify-between gap-4 relative z-10">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">Support</span>
                            </div>
                            <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
                                <div className="p-2 bg-blue-500/10 rounded-xl dark:bg-blue-500/20">
                                    <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                Bantuan & FAQ
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm max-w-[90%]">
                                Temukan solusi cepat untuk kendala Anda dalam menggunakan sistem informasi E-Skripsi.
                            </DialogDescription>
                        </div>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all">
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 px-8 pb-8">
                    <div className="space-y-4 py-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="relative">
                                    <div className="h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 animate-pulse" />
                                </div>
                                <p className="text-sm font-medium text-zinc-500 mt-4">Menyiapkan bantuan...</p>
                            </div>
                        ) : faqs.length === 0 ? (
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-10 flex flex-col items-center text-center border border-dashed border-zinc-200 dark:border-zinc-800">
                                <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm mb-4">
                                    <Info className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                                </div>
                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200 mb-1">Belum ada FAQ</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[250px]">
                                    Tim kami sedang menyusun daftar pertanyaan mendasar untuk membantu Anda.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {faqs.map((faq, index) => {
                                    const isActive = openIndex === index;
                                    return (
                                        <div
                                            key={faq.id}
                                            className={cn(
                                                "group rounded-2xl border transition-all duration-300",
                                                isActive
                                                    ? "bg-blue-50/30 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/50 ring-1 ring-blue-500/10 shadow-sm"
                                                    : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                                            )}
                                        >
                                            <button
                                                onClick={() => setOpenIndex(isActive ? null : index)}
                                                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 select-none cursor-pointer"
                                            >
                                                <span className={cn(
                                                    "text-sm font-semibold transition-colors leading-relaxed",
                                                    isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-700 dark:text-zinc-300"
                                                )}>
                                                    {faq.question}
                                                </span>
                                                <div className={cn(
                                                    "flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300",
                                                    isActive ? "bg-blue-500 text-white rotate-180" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                                                )}>
                                                    <ChevronDown className="h-4 w-4" />
                                                </div>
                                            </button>

                                            <div className={cn(
                                                "overflow-hidden transition-all duration-300 ease-in-out",
                                                isActive ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                                            )}>
                                                <div className="px-5 pb-5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-blue-100/50 dark:border-blue-900/20 pt-4">
                                                    {faq.answer.split('**').map((part, i) =>
                                                        i % 2 === 1 ? <span key={i} className="font-bold text-zinc-900 dark:text-zinc-100 bg-blue-500/5 px-1 rounded">{part}</span> : part
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="px-8 py-5 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        Masalah tidak teratasi?
                    </p>
                    <a
                        href="https://wa.me/your_number_here"
                        target="_blank"
                        className="flex items-center gap-2 group text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        Hubungi Tim IT Fakultas
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    );
}

