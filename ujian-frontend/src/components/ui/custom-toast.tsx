import { toast } from "sonner";
import { 
  IconCheck, 
  IconX, 
  IconInfoCircle, 
  IconAlertTriangle,
  IconLoader
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  description?: string;
  duration?: number;
}

const ToastContent = ({ 
  title, 
  description, 
  icon: Icon, 
  type,
  t
}: { 
  title: string; 
  description?: string; 
  icon: any; 
  type: "success" | "error" | "info" | "warning" | "loading";
  t: string | number;
}) => (
  <div className={cn(
    "flex w-full items-start gap-3.5 p-4 rounded-2xl shadow-lg border transition-all duration-300 backdrop-blur-md group",
    "hover:translate-x-[-2px] hover:shadow-xl",
    "bg-white/80 dark:bg-neutral-900/80", // Glassmorphism base
    
    // Modern subtle borders
    type === "success" && "border-green-200/50 dark:border-green-500/20",
    type === "error" && "border-red-200/50 dark:border-red-500/20",
    (type === "info" || type === "loading") && "border-blue-200/50 dark:border-blue-500/20",
    type === "warning" && "border-amber-200/50 dark:border-amber-500/20",
  )}>
    {/* Icon Wrapper */}
    <div className={cn(
      "p-2 rounded-full shrink-0 flex items-center justify-center ring-1 ring-inset shadow-sm",
      "transition-colors duration-300",
      
      // Light Mode Colors
      type === "success" && "bg-gradient-to-br from-green-50 to-green-100 text-green-600 ring-green-200",
      type === "error" && "bg-gradient-to-br from-red-50 to-red-100 text-red-600 ring-red-200",
      (type === "info" || type === "loading") && "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 ring-blue-200",
      type === "warning" && "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 ring-amber-200",
      
      // Dark Mode Colors
      type === "success" && "dark:from-green-900/40 dark:to-green-900/20 dark:text-green-400 dark:ring-green-500/20",
      type === "error" && "dark:from-red-900/40 dark:to-red-900/20 dark:text-red-400 dark:ring-red-500/20",
      (type === "info" || type === "loading") && "dark:from-blue-900/40 dark:to-blue-900/20 dark:text-blue-400 dark:ring-blue-500/20",
      type === "warning" && "dark:from-amber-900/40 dark:to-amber-900/20 dark:text-amber-400 dark:ring-amber-500/20",
    )}>
      <Icon size={18} stroke={2.5} className={type === "loading" ? "animate-spin" : ""} />
    </div>
    
    <div className="flex-1 space-y-1 py-0.5">
      <h3 className={cn(
        "font-semibold text-sm leading-none tracking-tight",
        "text-gray-900 dark:text-gray-100" // Modern neutral title color
      )}>
        {title}
      </h3>
      {description && (
        <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
    
    <button 
      onClick={() => toast.dismiss(t)}
      className="shrink-0 p-1.5 -mr-1 -mt-1 rounded-full text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
    >
      <IconX size={14} stroke={2.5} />
    </button>
  </div>
);

// Shared options to remove default wrapper styling so our custom card looks correct
const customToastOptions = {
  className: "!bg-transparent !border-0 !shadow-none !p-0 gap-0",
};

export const showToast = {
  success: (message: string, description?: string) => {
    toast.custom((t) => (
      <ToastContent 
        t={t}
        title={message} 
        description={description} 
        icon={IconCheck} 
        type="success" 
      />
    ), customToastOptions);
  },
  error: (message: string, description?: string) => {
    toast.custom((t) => (
      <ToastContent 
        t={t}
        title={message} 
        description={description} 
        icon={IconX} 
        type="error" 
      />
    ), customToastOptions);
  },
  info: (message: string, description?: string) => {
    toast.custom((t) => (
      <ToastContent 
        t={t}
        title={message} 
        description={description} 
        icon={IconInfoCircle} 
        type="info" 
      />
    ), customToastOptions);
  },
  warning: (message: string, description?: string) => {
    toast.custom((t) => (
      <ToastContent 
        t={t}
        title={message} 
        description={description} 
        icon={IconAlertTriangle} 
        type="warning" 
      />
    ), customToastOptions);
  },
  loading: (message: string, description?: string) => {
    return toast.custom((t) => (
      <ToastContent 
        t={t}
        title={message} 
        description={description} 
        icon={IconLoader} 
        type="loading"
      />
    ), { ...customToastOptions, duration: Infinity });
  },
  dismiss: (toastId: string | number) => toast.dismiss(toastId)
};
