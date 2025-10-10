"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PDFDocument } from "@/components/PDFDocument";
import { RancanganPenelitian } from "@/types/RancanganPenelitian";
import { useAuthStore } from "@/stores/useAuthStore";

interface RancanganPreviewProps {
  selected: RancanganPenelitian | null;
  onClose: () => void;
}

export function RancanganPreview({ selected, onClose }: RancanganPreviewProps) {
  const { user } = useAuthStore();

  return (
    <Dialog open={!!selected} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-hidden rounded">
        {selected && (
          <>
            <DialogHeader>
              <DialogTitle>Preview Rancangan Penelitian</DialogTitle>
            </DialogHeader>

            {/* PDF Preview Container */}
            <div className="bg-gray-100 p-4 rounded-lg max-h-[75vh] overflow-y-auto">
              <div
                className="bg-white shadow-2xl mx-auto"
                style={{ width: "210mm", minHeight: "297mm" }}
              >
                <PDFDocument rancangan={selected} id="pdf-content" />
              </div>
            </div>

            <DialogFooter className="">
              <Button variant="outline" onClick={onClose}>
                Tutup
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
