"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthInitializer() {
  const initializeFromCookies = useAuthStore((s) => s.initializeFromCookies);

  useEffect(() => {
    initializeFromCookies();
    console.log("✅ Zustand rehydrated from cookies");
  }, [initializeFromCookies]);

  return null; // gak render apa-apa
}
