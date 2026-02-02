"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // hindari mismatch SSR: render placeholder button
    return (
      <Button
        variant="ghost"
        size="icon"
        className="border-none"
        aria-label="Toggle theme"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="border-none relative h-10 w-10"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun
        className={
          "h-[1.2rem] w-[1.2rem] transition-all " +
          (isDark
            ? "scale-0 -rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100")
        }
      />
      <Moon
        className={
          "absolute h-[1.2rem] w-[1.2rem] transition-all " +
          (isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 rotate-90 opacity-0")
        }
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
