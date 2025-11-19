import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Modal({
  open,
  onClose,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        className={`relative ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X />
        </Button>

        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
