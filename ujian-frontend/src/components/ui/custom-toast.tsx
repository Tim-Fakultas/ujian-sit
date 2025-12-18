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
    "flex w-full items-start gap-3 p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-border/50 transition-all",
    "hover:scale-[1.01] active:scale-[0.99]",
    type === "success" && "border-green-500/20 bg-green-50/50 dark:bg-green-900/10",
    type === "error" && "border-red-500/20 bg-red-50/50 dark:bg-red-900/10",
    type === "info" && "border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10",
    type === "warning" && "border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-900/10",
  )}>
    <div className={cn(
      "p-2 rounded-xl shrink-0 flex items-center justify-center",
      type === "success" && "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
      type === "error" && "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
      type === "info" && "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      type === "warning" && "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
    )}>
      <Icon size={20} stroke={2} className={type === "loading" ? "animate-spin" : ""} />
    </div>
    <div className="flex-1 space-y-0.5 mt-0.5">
      <h3 className={cn(
        "font-semibold text-sm leading-none tracking-tight",
        type === "success" && "text-green-900 dark:text-green-100",
        type === "error" && "text-red-900 dark:text-red-100",
        type === "info" && "text-blue-900 dark:text-blue-100",
        type === "warning" && "text-yellow-900 dark:text-yellow-100",
      )}>
        {title}
      </h3>
      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed opacity-90">
          {description}
        </p>
      )}
    </div>
    <button 
      onClick={() => toast.dismiss(t)}
      className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
    >
      <IconX size={16} />
    </button>
  </div>
);

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
    ));
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
    ));
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
    ));
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
    ));
  },
  loading: (message: string, description?: string) => {
    return toast.custom((t) => (
      <ToastContent 
        t={t}
        title={message} 
        description={description} 
        icon={IconLoader} 
        type="info" // Using info styling for loading but with specific icon
      />
    ), { duration: Infinity });
  },
  dismiss: (toastId: string | number) => toast.dismiss(toastId)
};
