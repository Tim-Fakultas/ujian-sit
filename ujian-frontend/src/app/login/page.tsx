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
  const [loading, setLoading] = useState(false); // loading state

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true); // set loading true

    const formData = new FormData();
    formData.set("nip_nim", username);
    formData.set("password", password);

    const result = await loginAction(formData);

    setLoading(false); // set loading false after action

    if (!result.success) {
      setError(result.message);
      return;
    }

    setUser(result.user);
    
    // Store token if available
    const loginResult = result as any;
    if (loginResult.access_token) {
      useAuthStore.getState().setToken(loginResult.access_token);
    }

    // Get the first role name from user roles array
    const userRole =
      result.user.roles && result.user.roles.length > 0
        ? result.user.roles[0].name
        : null;

    if (userRole === "admin") {
      router.push("/admin/dashboard");
    } else if (userRole === "dosen") {
      router.push("/dosen/dashboard");
    } else if (userRole === "mahasiswa") {
      router.push("/mahasiswa/dashboard");
    } else {
      setError("Role user tidak dikenali");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
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

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-site-header hover:bg-[#4e55c4] text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Login"
              )}
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
