// app/providers.tsx
"use client";
import { SWRConfig } from "swr";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => fetch(url).then((res) => res.json()),
        refreshInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
