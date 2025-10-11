import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UjianPageHeaderProps {
  onSeminarProposal: () => void;
  onSeminarHasil: () => void;
  onUjianSkripsi: () => void;
}

export default function UjianPageHeader({
  onSeminarProposal,
  onSeminarHasil,
  onUjianSkripsi,
}: UjianPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Daftar Ujian</h1>
        <p className="text-gray-600 mt-1">
          Lihat semua jadwal dan hasil ujian Anda
        </p>
      </div>

      {/* Tombol Pengajuan Seminar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded">
            <Send className="mr-2 h-4 w-4" />
            Pengajuan Seminar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onSeminarProposal}>
            Seminar Proposal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSeminarHasil}>
            Seminar Hasil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUjianSkripsi}>
            Seminar/Ujian Skripsi
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
