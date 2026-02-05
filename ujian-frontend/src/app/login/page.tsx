import Image from "next/image";
import LoginForm from "./LoginForm";
import { GraduationCap } from "lucide-react";
import { FaqModal } from "@/components/common/FaqModal";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden selection:bg-blue-500/30">

      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[1000px] h-auto lg:h-[500px] m-4 lg:m-0 grid lg:grid-cols-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/60 backdrop-blur-xl relative z-10 transition-all duration-300 hover:shadow-blue-900/10">

        {/* Left Side - Visual */}
        <div className="relative h-full hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-gradient-to-br from-blue-600/10 to-transparent">
          <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay" />

          {/* Decorative Circles */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 backdrop-blur-md shadow-inner">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-lg font-semibold text-white tracking-wide">E-Skripsi</span>
          </div>

          {/* Center Content */}
          <div className="relative z-10 space-y-6">
            <div className="relative w-24 h-24 bg-white/5 rounded-2xl p-4 border border-white/10 shadow-2xl backdrop-blur-sm group hover:scale-105 transition-transform duration-500">
              <Image
                src="/images/uin-raden-fatah.webp"
                alt="UIN Raden Fatah"
                fill
                className="object-contain p-2 drop-shadow-xl"
                priority
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 leading-tight tracking-tight">
                Fakultas Sains <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  dan Teknologi
                </span>
              </h1>
              <p className="text-base text-zinc-400 leading-relaxed max-w-sm font-light">
                Sistem Informasi Pengelolaan Skripsi, Tugas Akhir, dan Penilaian Ujian Mahasiswa UIN Raden Fatah Palembang.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 backdrop-blur-md w-fit">
              <span className="text-xs font-medium text-blue-200 tracking-wide">V.1.0.0</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="relative flex flex-col justify-center p-8 lg:p-12 bg-white dark:bg-zinc-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="space-y-1.5 text-center lg:text-left">
              {/* Mobile Logo */}
              <div className="lg:hidden mx-auto w-14 h-14 relative mb-4">
                <Image
                  src="/images/uin-raden-fatah.webp"
                  alt="UIN Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Selamat Datang</h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Masuk untuk mengakses dashboard Anda</p>
            </div>

            <LoginForm />

            <div className="text-center gap-1 flex flex-col items-center -mt-2">
              <FaqModal />
              <p className="text-xs text-zinc-400">
                &copy; {new Date().getFullYear()} UIN Raden Fatah Palembang
              </p>
            </div>
          </div>

          {/* Version Number */}
          <div className="absolute bottom-4 left-4 text-[10px] text-zinc-900 dark:text-zinc-700 font-mono">
            V.1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}

