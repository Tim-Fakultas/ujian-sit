import { LoginForm } from "@/components/login-form";
import { MenuIcon } from "lucide-react";

export default function LoginPage() {
  return (
    <>
      {/* <nav className="flex h-14 items-center shadow-sm bg-white px-4 justify-between">
        <div className="flex flex-col">
          <h1 className="text-lg font-medium leading-tight">Integration System.</h1>
          <span className="text-xs leading-tight">Faculty of Sains & Technology</span>
        </div>
      </nav> */}
      <div className="flex min-h-screen items-start justify-center gap-5 ">
        <LoginForm />
      </div>
      <footer>
        <div className="flex h-14 items-center justify-center bg-white shadow-sm">
          <span className="text-sm text-neutral-500">
            &copy; 2025 Integration System. All rights reserved.
          </span>
        </div>
      </footer>
    </>
  );
}
