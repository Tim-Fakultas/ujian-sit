"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-neutral-950 relative overflow-hidden font-sans selection:bg-primary/10 selection:text-primary">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px] dark:bg-primary"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
        {/* Icon */}
        <div className="mb-8 p-4 rounded-full bg-white dark:bg-neutral-900 shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10 animate-in fade-in zoom-in duration-500">
          <div className="p-4 rounded-full bg-primary/5 dark:bg-primary/20">
            <FileQuestion
              className="w-12 h-12 text-primary dark:text-primary"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2 mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
          <h1 className="text-8xl font-bold tracking-tighter text-gray-900 dark:text-white">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-md mx-auto mt-4">
            Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus,
            atau tidak pernah ada.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="gap-2 h-11 px-6 border-gray-200 dark:border-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-gray-300 rounded-xl"
          >
            <ArrowLeft size={16} />
            Kembali
          </Button>
          <Button
            asChild
            className="gap-2 h-11 px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 dark:shadow-primary/40 border-0 rounded-xl"
          >
            <Link href="/">
              <Home size={16} />
              Ke Beranda
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-xs text-gray-400 dark:text-neutral-600 animate-in fade-in duration-1000 delay-500">
        &copy; {new Date().getFullYear()} E-Skripsi. All rights reserved.
      </div>
    </div>
  );
}
