"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthInitializer() {
  const { initializeFromCookies, refreshUser } = useAuthStore();
  
  useEffect(() => {
    initializeFromCookies();
    refreshUser(); 
  }, [initializeFromCookies, refreshUser]);

  return null;
}
