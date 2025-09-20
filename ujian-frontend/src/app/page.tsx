// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import MahasiswaPage from "./(dashboard)/mahasiswa/pengajuan/page";
import LoginPage from "./auth/login/page";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // atau cookie
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return <MahasiswaPage />;
}
