import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="text-center mb-6  justify-center flex items-center">
            <Image
              src="/images/uin-raden-fatah.webp"
              alt="UIN Logo"
              width={100}
              height={100}
              priority
            />
          </div>
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm px-4">
          <Card className="shadow-md border-0 backdrop-blur-xs">
            <CardHeader className="text-center pb-2">
              <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
              <p className="text-xs text-gray-600 mt-1">
                Masuk dengan akun SIMAK Anda
              </p>
            </CardHeader>

            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <GraduationCap className="h-3 w-3" />
              <span>UIN Raden Fatah Palembang</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">© 2025 E-Skripsi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
