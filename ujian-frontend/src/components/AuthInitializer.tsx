"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthInitializer() {
  const { refreshUser } = useAuthStore();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    // Hanya refresh sekali saat pertama mount untuk sinkronisasi dengan server
    if (!hasRefreshed.current) {
      hasRefreshed.current = true;
      refreshUser();
    }
  }, [refreshUser]);

  return null;
}
