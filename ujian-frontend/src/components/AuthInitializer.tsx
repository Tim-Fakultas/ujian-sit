"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthInitializer() {
  const initializeFromCookies = useAuthStore((s) => s.initializeFromCookies);

  useEffect(() => {
    initializeFromCookies();
  }, [initializeFromCookies]);

  return null;
}
