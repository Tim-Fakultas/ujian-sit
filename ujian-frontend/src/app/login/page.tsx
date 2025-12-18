import Image from "next/image";
import LoginForm from "./LoginForm";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-zinc-900 to-zinc-900" />
        
        {/* Abstract shapes/glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[100px]" />
             <div className="absolute top-[40%] right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[100px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3 text-lg font-medium">
             <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <GraduationCap className="h-6 w-6 text-blue-400" />
             </div>
            <span className="tracking-wide">E-Skripsi</span>
        </div>

        <div className="relative z-10 space-y-6">
           <div className="relative w-24 h-24 mb-6 bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10 shadow-2xl">
              <Image
                  src="/images/uin-raden-fatah.webp"
                  alt="UIN Logo"
                  fill
                  className="object-contain p-2"
                  priority
                />
           </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
             Fakultas Sains <br/>
             <span className="text-blue-400">dan Teknologi</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-md leading-relaxed">
            Sistem Informasi Pengelolaan Skripsi, Tugas Akhir, dan Penilaian Ujian Mahasiswa UIN Raden Fatah Palembang.
          </p>
        </div>

        <div className="relative z-10 text-sm text-gray-500 font-medium">
           &copy; {new Date().getFullYear()} UIN Raden Fatah Palembang
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center min-h-screen lg:min-h-0 p-4 sm:p-8 bg-gray-50 dark:bg-black">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:space-y-8 sm:w-[400px] bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-zinc-800">
          <div className="flex flex-col space-y-2 text-center">
             {/* Mobile Logo */}
            <div className="mx-auto mb-6 h-16 w-16 relative lg:hidden">
                 <Image
                  src="/images/uin-raden-fatah.webp"
                  alt="UIN Logo"
                  fill
                  className="object-contain"
                  priority
                />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Selamat Datang
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masuk untuk mengakses dashboard Anda
            </p>
          </div>

          <LoginForm />
          
        </div>
      </div>
    </div>
  );
}

