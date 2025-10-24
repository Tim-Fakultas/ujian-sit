"use client";
import { Button } from "@/components/ui/button";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { Eye } from "lucide-react";

export default function PreviewButton(data: PengajuanRanpel) {
  return (
    <Button variant="outline" className="text-xs">
      <Eye className="mr-1 " size={4} />
      Preview
    </Button>
  );
}
