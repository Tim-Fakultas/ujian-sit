// "use client";

// import { useState } from "react";
// import { Label } from "./ui/label";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { EyeIcon, EyeOff } from "lucide-react";
// import Link from "next/link";
// import { loginAction } from "@/actions/loginAction";
// import { redirect } from "next/navigation";
// import Image from "next/image";

// export function LoginForm() {
//   const [error, setError] = useState<string | null>(null);
//   const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   async function handleSubmit(formData: FormData) {
//     setError(null);
//     setFieldErrors({});
//     const result = await loginAction(formData);

//     if (!result.success) {
//       if (result.errors) {
//         setFieldErrors(result.errors);
//       } else {
//         setError(result.message);
//       }
//       return;
//     }
//     redirect("/mahasiswa/dashboard");
//   }

//   return (
//     <form
//       action={handleSubmit}
//       className="w-full max-w-sm flex flex-col gap-6 rounded-sm p-6 sm:mt-8 mt-20"
//     >
//       {/* Header */}
//       <div>
//         <Image
//           src="/images/uin-raden-fatah.png"
//           alt="uin"
//           width={90}
//           height={90}
//           className="mx-auto mb-4"
//         />
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-medium text-neutral-700">
//             Assalamualaikum!
//           </h1>
//           <p className="text-sm text-neutral-500">
//             Login menggunakan akun SIMAK
//           </p>
//         </div>
//       </div>

//       {/* Username */}
//       <div className="space-y-2">
//         <Label htmlFor="username">
//           Username <span className="text-red-500">*</span>
//         </Label>
//         <Input
//           id="username"
//           name="username"
//           type="text"
//           placeholder="NIM / NIDN / NIP"
//           required
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="focus:border-blue-500 focus:ring-blue-500 p-5"
//         />
//         {fieldErrors.username && (
//           <p className="text-xs text-red-500">
//             {fieldErrors.username.join(", ")}
//           </p>
//         )}
//       </div>

//       {/* Password */}
//       <div className="space-y-2">
//         <Label htmlFor="password">
//           Password <span className="text-red-500">*</span>
//         </Label>
//         <div className="relative">
//           <Input
//             id="password"
//             name="password"
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="pr-10 focus:border-blue-500 focus:ring-blue-500 p-5"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword((prev) => !prev)}
//             className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
//           >
//             {showPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
//           </button>
//         </div>
//         {fieldErrors.password && (
//           <p className="text-xs text-red-500">
//             {fieldErrors.password.join(", ")}
//           </p>
//         )}
//         <div className="flex justify-end">
//           <Link
//             href="/"
//             className="text-xs text-blue-700 font-semibold underline"
//           >
//             Lupa password? SIMAK
//           </Link>
//         </div>
//       </div>

//       {/* Error global */}
//       {error && <p className="text-sm text-red-500">{error}</p>}

//       {/* Submit */}
//       <Button
//         type="submit"
//         disabled={!username || !password}
//         className="bg-site-header hover:bg-site-header p-5 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         Login
//       </Button>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EyeIcon, EyeOff } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/actions/loginAction";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/stores/useAuthStore";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 
const setUser = useAuthStore((state) => state.setUser);

async function handleSubmit(formData: FormData) {
  setError(null);
  const result = await loginAction(formData);

  if (!result.success) {
    setError(result.message);
    return;
  }

  // Simpan user ke global state
  setUser(result.user);

  redirect("/mahasiswa/dashboard");
}

  return (
    <form
      action={handleSubmit}
      className="w-full max-w-sm flex flex-col gap-6 rounded-sm p-6 sm:mt-8 mt-18"
    >
      {/* Header */}
      <div>
        <Image
          src="/images/uin-raden-fatah.png"
          alt="uin"
          width={90}
          height={90}
          className="mx-auto mb-4"
        />
        <div className="text-center mb-6">
          <h1 className="text-2xl font-medium text-neutral-700">
            Assalamualaikum!
          </h1>
          <p className="text-sm text-neutral-500">
            Login menggunakan akun SIMAK
          </p>
        </div>
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="nip_nim">
          Username <span className="text-red-500">*</span>
        </Label>
        <Input
          id="nip_nim"
          name="nip_nim"
          type="text"
          placeholder="NIM / NIDN / NIP"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="focus:border-blue-500 focus:ring-blue-500 p-3"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">
          Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10 focus:border-blue-500 focus:ring-blue-500 p-3"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
        <div className="flex justify-end">
          <Link
            href="/"
            className="text-xs text-blue-700 font-semibold underline"
          >
            Lupa password? SIMAK
          </Link>
        </div>
      </div>

      {/* Error global */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Submit */}
      <Button
        type="submit"
        disabled={!username || !password}
        className="bg-[#1B82EC] hover:bg-[#1B82EC]/90 p-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Login
      </Button>
    </form>
  );
}
