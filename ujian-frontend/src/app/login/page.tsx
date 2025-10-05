// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { User, Lock, Eye, EyeOff, Shield, GraduationCap } from "lucide-react";
// import { loginAction } from "@/actions/loginAction";
// import { useAuthStore } from "@/stores/useAuthStore";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const setUser = useAuthStore((state) => state.setUser);
//   const router = useRouter();

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     const formData = new FormData();
//     formData.set("nip_nim", username);
//     formData.set("password", password);

//     const result = await loginAction(formData);
//     setLoading(false);

//     if (!result.success) {
//       setError(result.message);
//       return;
//     }

//     // Simpan user ke store dan cookie
//     setUser(result.user);

//     // Simpan token kalau ada
//     if (result.access_token) {
//       useAuthStore.getState().setToken(result.access_token);
//     }

//     // Ambil role user dari berbagai kemungkinan struktur
//     const userRole =
//       (result.roles && result.roles.length > 0 && result.roles[0]) ||
//       (result.user.roles && result.user.roles.length > 0 && result.user.roles[0].name) ||
//       result.role ||
//       null;

//     console.log("Detected role:", userRole);

//     // Redirect berdasarkan role
//     if (userRole === "super admin") {
//       router.push("/superadmin/dashboard");
//     } else if (userRole === "admin prodi") {
//       router.push("/admin/dashboard");
//     } else if (userRole === "sekprodi") {
//       router.push("/sekprodi/dashboard");
//     } else if (userRole === "dosen") {
//       router.push("/dosen/dashboard");
//     } else if (userRole === "mahasiswa") {
//       router.push("/mahasiswa/dashboard");
//     } else if (userRole === "kaprodi") {
//       router.push("/kaprodi/dashboard");
//     } else {
//       setError("Role user tidak dikenali");
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
//       <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-800 to-blue-600 rounded-xl mb-3 shadow-lg">
//               <Image
//                 src="/images/uin-raden-fatah.png"
//                 alt="UIN Logo"
//                 width={24}
//                 height={24}
//                 className="filter brightness-0 invert"
//               />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-1">
//               Selamat Datang
//             </h1>
//             <p className="text-sm text-gray-600">
//               Sistem Informasi Ujian Skripsi
//             </p>
//           </div>
//         </div>

//         <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm px-4">
//           <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
//             <CardHeader className="space-y-1 pb-4 pt-6">
//               <div className="text-center">
//                 <h2 className="text-lg font-semibold text-gray-900">Login</h2>
//                 <p className="text-xs text-gray-600 mt-1">
//                   Masuk dengan akun SIMAK Anda
//                 </p>
//               </div>
//             </CardHeader>

//             <CardContent className="pb-6">
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* Username */}
//                 <div className="space-y-1">
//                   <Label htmlFor="nip_nim" className="text-xs font-medium text-gray-700">
//                     Username
//                   </Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="nip_nim"
//                       name="nip_nim"
//                       type="text"
//                       placeholder="NIM / NIDN / NIP"
//                       className="pl-9 h-10 text-sm border-gray-200 focus:border-blue-600 focus:ring-blue-600 rounded-lg"
//                       required
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div className="space-y-1">
//                   <Label htmlFor="password" className="text-xs font-medium text-gray-700">
//                     Password
//                   </Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Masukkan password"
//                       className="pl-9 pr-10 h-10 text-sm border-gray-200 focus:border-blue-600 focus:ring-blue-600 rounded-lg"
//                       required
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Error */}
//                 {error && (
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-2">
//                     <p className="text-xs text-red-600">{error}</p>
//                   </div>
//                 )}

//                 {/* Submit */}
//                 <Button
//                   type="submit"
//                   className="w-full h-10 bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
//                       <span className="text-sm">Sedang masuk...</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-center">
//                       <Shield className="h-4 w-4 mr-2" />
//                       <span className="text-sm">Masuk</span>
//                     </div>
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>

//           {/* Footer */}
//           <div className="text-center mt-6">
//             <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
//               <GraduationCap className="h-3 w-3" />
//               <span>UIN Raden Fatah Palembang</span>
//             </div>
//             <p className="text-xs text-gray-400 mt-1">
//               © 2025 Sistem Informasi Ujian Skripsi
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Lock, Eye, EyeOff, Shield, GraduationCap } from "lucide-react";
import { loginAction } from "@/actions/loginAction";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

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

    // Redirect sesuai role
    if (userRole === "super admin") {
      router.push("/super-admin/dashboard");
    } else if (userRole === "admin prodi") {
      router.push("/admin/dashboard");
    } else if (userRole === "sekprodi") {
      router.push("/sekprodi/dashboard");
    } else if (userRole === "kaprodi") {
      router.push("/kaprodi/dashboard");
    } else if (userRole === "dosen") {
      router.push("/dosen/dashboard");
    } else if (userRole === "mahasiswa") {
      router.push("/mahasiswa/dashboard");
    } else {
      setError("Role user tidak dikenali");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-800 to-blue-600 rounded-xl mb-3 shadow-lg">
              <Image
                src="/images/uin-raden-fatah.png"
                alt="UIN Logo"
                width={24}
                height={24}
                className="filter brightness-0 invert"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Selamat Datang
            </h1>
            <p className="text-sm text-gray-600">
              Sistem Informasi Ujian Skripsi
            </p>
          </div>
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm px-4">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4 pt-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900">Login</h2>
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
                  className="w-full h-10 bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      <span className="text-sm">Sedang masuk...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Shield className="h-4 w-4 mr-2" />
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
              © 2025 Sistem Informasi Ujian Skripsi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
