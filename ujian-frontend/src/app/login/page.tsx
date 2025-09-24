"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/actions/loginAction";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("nip_nim", username);
    formData.set("password", password);

    const result = await loginAction(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // simpan user ke global state
    setUser(result.user);

    router.push("/mahasiswa/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb]">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Kiri */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-16 py-12">
          <div className="flex items-center mb-10">
            <Image
              src="/images/uin-raden-fatah.png"
              alt="UIN Logo"
              width={50}
              height={50}
            />
            <span className="text-xl font-medium text-gray-500">
              Integration System
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            Assalamu&apos;alaikum
          </h1>
          <p className="text-gray-600 mb-8">Login menggunakan akun SIMAK</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="nip_nim">
                Username <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                <Input
                  id="nip_nim"
                  name="nip_nim"
                  type="text"
                  placeholder="NIM / NIDN / NIP"
                  className="pl-10"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  className="pl-10 pr-10"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox + Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm text-site-header hover:underline">
                Lupa password?
              </a>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-site-header hover:bg-[#4e55c4] text-white"
            >
              Login
            </Button>
          </form>
        </div>

        {/* Kanan */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 rounded-md">
          <Image
            src="/images/login.jpg"
            alt="Login Illustration"
            width={500}
            height={500}
            className="object-contain scale-110 rounded-md"
            priority
          />
        </div>
      </div>
    </div>
  );
}
