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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function FaqModal() {
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
                <Button variant="ghost" size="sm" className="gap-2 text-zinc-500 hover:text-primary hover:bg-primary/10 transition-all  px-4 font-semibold">
                    <HelpCircle className="h-4 w-4" />
                    <span>Bantuan & FAQ</span>
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="max-w-[90%] sm:w-full sm:max-w-2xl max-h-[85vh] rounded-[2rem] flex flex-col p-0 gap-0 bg-white dark:bg-zinc-950 border-none shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-primary" />

                <DialogHeader className="p-8 pb-4 relative overflow-hidden text-left">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex items-start justify-between gap-4 relative z-10">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">Support Center</span>
                            </div>
                            <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
                                <div className="p-2.5 bg-primary/10 rounded-2xl dark:bg-primary/20">
                                    <MessageCircle className="h-6 w-6 text-primary dark:text-blue-400" />
                                </div>
                                Bantuan & FAQ
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm max-w-[90%] font-medium">
                                Temukan solusi cepat untuk kendala Anda dalam menggunakan sistem informasi E-Skripsi.
                            </DialogDescription>
                        </div>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 border border-zinc-100 dark:border-zinc-800 rounded-full bg-zinc-50/50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all hover:scale-105">
                                <X className="h-5 w-5" />
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 px-8 pb-8 overflow-anchor-none">
                    <div className="space-y-4 py-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <div className="relative">
                                    <div className="h-14 w-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-500 mt-6 tracking-wide">Menyiapkan bantuan...</p>
                            </div>
                        ) : faqs.length === 0 ? (
                            <div className="bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[2rem] p-12 flex flex-col items-center text-center border border-dashed border-zinc-200 dark:border-zinc-800">
                                <div className="p-5 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm mb-5">
                                    <Info className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                                </div>
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-200 mb-2">Belum ada FAQ</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[280px] leading-relaxed">
                                    Tim kami sedang menyusun daftar pertanyaan mendasar untuk membantu Anda.
                                </p>
                            </div>
                        ) : (
                            <Accordion type="single" collapsible className="space-y-4">
                                {faqs.map((faq) => (
                                    <AccordionItem
                                        key={faq.id}
                                        value={faq.id.toString()}
                                        className="rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 transition-all duration-300 overflow-hidden data-[state=open]:bg-primary/2 dark:data-[state=open]:bg-primary/5 data-[state=open]:border-primary/20 dark:data-[state=open]:border-primary/40 data-[state=open]:ring-1 data-[state=open]:ring-primary/5 data-[state=open]:shadow-sm"
                                    >
                                        <AccordionTrigger className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 select-none cursor-pointer hover:no-underline [&>svg]:hidden">
                                            <span className="text-sm font-bold transition-colors leading-relaxed text-zinc-700 dark:text-zinc-300 group-data-[state=open]:text-primary dark:group-data-[state=open]:text-blue-400">
                                                {faq.question}
                                            </span>
                                            <div className="shrink-0 h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center transition-all duration-300 shadow-sm group-data-[state=open]:bg-primary group-data-[state=open]:text-white group-data-[state=open]:rotate-180">
                                                <ChevronDown className="h-4 w-4" />
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pt-2 border-t border-primary/10 dark:border-primary/20">
                                            {faq.answer.split('**').map((part, i) =>
                                                i % 2 === 1 ? (
                                                    <span key={i} className="font-bold text-zinc-900 dark:text-zinc-100 bg-primary/10 px-1 rounded mx-0.5">
                                                        {part}
                                                    </span>
                                                ) : (
                                                    part
                                                )
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

