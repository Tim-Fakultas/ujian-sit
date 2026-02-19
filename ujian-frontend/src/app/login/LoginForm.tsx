"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "@/actions/auth";
import { useAuthStore } from "@/stores/useAuthStore";
import type { User as AuthUser } from "@/types/Auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { showToast } from "@/components/ui/custom-toast";
import { loginClientSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginClientSchema),
    defaultValues: {
      nip_nim: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (data: LoginInput) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("nip_nim", data.nip_nim);
      formData.append("password", data.password);
      if (data.remember) {
        formData.append("remember", "on");
      }

      const result = await loginAction(formData);

      if (!result || !result.success) {
        showToast.error(result?.message || "Login gagal. Silakan coba lagi.");
        return;
      }

      // Simpan user ke Zustand store (otomatis persist ke localStorage)
      if (result.user) {
        setUser(result.user as AuthUser);
      }

      // Redirect ke dashboard sesuai role
      if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="nip_nim"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Username
          </Label>
          {errors.nip_nim && (
            <p className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
              {errors.nip_nim.message}
            </p>
          )}
        </div>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <Input
            id="nip_nim"
            {...register("nip_nim")}
            placeholder="Masukkan username anda"
            autoComplete="username"
            className={`pl-10 h-11 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl ${
              errors.nip_nim
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : ""
            }`}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </Label>
          {errors.password && (
            <p className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <Input
            id="password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password anda"
            autoComplete="current-password"
            className={`pl-10 pr-10 h-11 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl ${
              errors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : ""
            }`}
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 cursor-pointer"
            disabled={isPending}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="remember"
              disabled={isPending}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label
          htmlFor="remember"
          className="text-sm text-gray-500 font-normal cursor-pointer"
        >
          Ingat saya di perangkat ini
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 rounded-xl group relative overflow-hidden"
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
