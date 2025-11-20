import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#1A1A1A] flex items-center justify-center">
      <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className=" sm:mx-auto sm:w-full sm:max-w-[350px] px-4">
          <Card className="border-none rounded-lg shadow-lg bg-white dark:bg-[#2c2c2c]">
            <CardHeader className="text-center pb-2">
              <div className="text-center justify-center flex items-center">
                <Image
                  src="/images/uin-raden-fatah.webp"
                  alt="UIN Logo"
                  width={85}
                  height={85}
                  priority
                />
              </div>
              <p className="text-sm  mt-1">Masuk dengan akun SIMAK Anda</p>
            </CardHeader>

            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <GraduationCap className="h-3 w-3" />
              <span>UIN Raden Fatah Palembang</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">© 2025 E-Skripsi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
