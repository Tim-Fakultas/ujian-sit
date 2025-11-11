"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (!result?.success) {
        setError(result?.message || "Failed to login. Please try again.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="nip_nim" className="text-xs font-medium text-gray-700">
          Username
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="nip_nim"
            name="nip_nim"
            placeholder="Username"
            required
            className="pl-9 h-10 text-xs   rounded-lg placeholder:text-xs"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="password" className="text-xs font-medium text-gray-700">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            required
            className="pl-9 pr-10 h-10 text-xs placeholder:text-xs border-gray-200  rounded-lg"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-10 bg-blue-400  hover:bg-blue-500 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            <span className="text-sm">Logging in...</span>
          </div>
        ) : (
          <span className="text-sm">Login</span>
        )}
      </Button>
    </form>
  );
}
