"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Lock, Eye, EyeOff, Shield, GraduationCap } from "lucide-react";
import { loginAction } from "@/actions/loginAction";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set("nip_nim", username);
    formData.set("password", password);

    const result = await loginAction(formData);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Simpan user & token ke store
    setUser(result.user);
    if (result.access_token) {
      useAuthStore.getState().setToken(result.access_token);
    }

    // Dapatkan role utama user
    const userRole =
      result.user.roles && result.user.roles.length > 0
        ? result.user.roles[0].name
        : null;

    console.log("Detected user role:", userRole);

    // Redirect berdasarkan role
    if (userRole) {
      if (userRole === "admin") {
        window.location.href = "/admin";
      } else if (userRole === "super admin") {
        window.location.href = "/super-admin/dashboard";
      } else if (userRole === "dosen") {
        window.location.href = "/dosen/dashboard";
      } else if (userRole === "mahasiswa") {
        window.location.href = "/mahasiswa/dashboard";
      } else if (userRole === "kaprodi") {
        window.location.href = "/kaprodi/dashboard";
      } else if (userRole === "sekprodi") {
        window.location.href = "/sekprodi/dashboard";
      } else if (userRole === "admin prodi") {
        window.location.href = "/admin/dashboard";
      } else {
        // Role tidak dikenal, redirect ke login
        window.location.href = "/login";
      }
    }
  }
  return (
    <div className="min-h-screen ">
      <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center ">
              <Image
                src="/images/uin-raden-fatah.png"
                alt="UIN Logo"
                width={100}
                height={1000}
                className=""
              />
            </div>
          </div>
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm px-4">
          <Card className="shadow-md border-0 backdrop-blur-xs">
            <CardHeader className="space-y-1 pb-4 ">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
                <p className="text-xs text-gray-600 mt-1">
                  Masuk dengan akun SIMAK Anda
                </p>
              </div>
            </CardHeader>

            <CardContent className="pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div className="space-y-1">
                  <Label
                    htmlFor="nip_nim"
                    className="text-xs font-medium text-gray-700"
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="nip_nim"
                      name="nip_nim"
                      type="text"
                      placeholder="NIM / NIDN / NIP"
                      className="pl-9 h-10 text-sm border-gray-200 focus:border-blue-600 focus:ring-blue-600 rounded-lg"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label
                    htmlFor="password"
                    className="text-xs font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      className="pl-9 pr-10 h-10 text-sm border-gray-200 focus:border-blue-600 focus:ring-blue-600 rounded-lg"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-10 bg-blue-600  hover:bg-blue-700  text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      <span className="text-sm">Sedang masuk...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="text-sm">Masuk</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <GraduationCap className="h-3 w-3" />
              <span>UIN Raden Fatah Palembang</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              © 2025 E-Skripsi 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
