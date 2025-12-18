import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  variant?: "inline" | "fullscreen" | "overlay" | "section";
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
}

export default function Loading({
  className,
  variant = "inline",
  size = "md",
  text = "Memuat data...",
}: LoadingProps) {
  // Map size to Tailwind classes
  const sizeClasses = {
    sm: "size-4", // 16px
    md: "size-8", // 32px
    lg: "size-12", // 48px
    xl: "size-16", // 64px
  };

  const spinnerElement = (
    <div className="relative flex items-center justify-center">
      {/* Background Glow Effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse",
          size === "sm" && "blur-sm"
        )}
      />
      {/* The component */}
      <Spinner
        className={cn(
          "relative z-10 text-blue-600 dark:text-blue-400",
          sizeClasses[size]
        )}
      />
    </div>
  );

  // Variant: Fullscreen Overlay (Fixed)
  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-300">
        {spinnerElement}
        {text && (
          <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  // Variant: Overlay (Absolute to parent)
  if (variant === "overlay") {
    return (
      <div
        className={cn(
          "absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-[2px] rounded-inherit transition-all duration-300",
          className
        )}
      >
        {spinnerElement}
      </div>
    );
  }

  // Variant: Section (Larger padding, centered in a block)
  if (variant === "section") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-16 w-full",
          className
        )}
      >
        {spinnerElement}
        {text && (
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            {text}
          </p>
        )}
      </div>
    );
  }

  // Variant: Inline (Default)
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 gap-3",
        className
      )}
    >
      {spinnerElement}
      {text && (
        <p className="text-xs font-medium text-muted-foreground">{text}</p>
      )}
    </div>
  );
}
