import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type Step = {
    id: string;
    label: string;
    description?: string;
    status: "completed" | "current" | "upcoming";
};

interface AcademicStepperProps {
    steps: Step[];
    className?: string;
}

export function AcademicStepper({ steps, className }: AcademicStepperProps) {
    return (
        <div className={cn("w-full py-4", className)}>
            <ol className="flex items-center w-full relative justify-between">
                {/* Connecting Line - Background */}
                <div className="absolute left-0 top-4 -translate-y-1/2 w-full h-0.5 bg-muted -z-10" />

                {steps.map((step, index) => {
                    // Calculate progress line for completed steps
                    // Note: This simple implementation draws a line behind all steps. 
                    // For a dynamic filled line, we'd need more logic or absolute positioning between nodes.
                    // For now, let's keep it simple with nodes.

                    return (
                        <li key={step.id} className="relative flex flex-col items-center group">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-background",
                                    step.status === "completed"
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : step.status === "current"
                                            ? "border-primary ring-4 ring-primary/20 text-primary font-bold"
                                            : "border-muted-foreground/30 text-muted-foreground"
                                )}
                            >
                                {step.status === "completed" ? (
                                    <Check size={16} strokeWidth={3} />
                                ) : (
                                    <span className="text-xs">{index + 1}</span>
                                )}
                            </div>

                            <div className="absolute top-10 flex flex-col items-center text-center w-32">
                                <span
                                    className={cn(
                                        "text-xs font-semibold tracking-tight",
                                        step.status === "upcoming" ? "text-muted-foreground" : "text-foreground"
                                    )}
                                >
                                    {step.label}
                                </span>
                                {step.description && (
                                    <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                                        {step.description}
                                    </span>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ol>
            {/* Spacer for bottom labels */}
            <div className="h-12" />
        </div>
    );
}
