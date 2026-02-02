"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { showToast } from "@/components/ui/custom-toast";
import Link from "next/link";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await loginAction(formData);
      if (!result?.success) {
        showToast.error(result?.message || "Login gagal. Silakan coba lagi.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nip_nim" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Username / NIM / NIP
        </Label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            id="nip_nim"
            name="nip_nim"
            placeholder="Masukkan username anda"
            required
            autoComplete="username"
            className="pl-10 h-11 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </Label>
          <Link
            href="#"
            className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline"
            aria-disabled={isPending}
          >
            Lupa password?
          </Link>
        </div>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password anda"
            required
            autoComplete="current-password"
            className="pl-10 pr-10 h-11 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl"
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
            disabled={isPending}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="remember" disabled={isPending} />
        <Label htmlFor="remember" className="text-sm text-gray-500 font-normal cursor-pointer">
          Ingat saya di perangkat ini
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 rounded-xl group relative overflow-hidden"
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sedang memproses...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 relative z-10">
            <span>Masuk ke Sistem</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </Button>
    </form>
  );
}

