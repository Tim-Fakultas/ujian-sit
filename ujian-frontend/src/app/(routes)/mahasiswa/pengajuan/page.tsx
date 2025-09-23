import { TablePengajuan } from "@/components/table-pengajuan";
import { getPengajuanById } from "@/actions/pengajuan";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function MahasiswaPage() {
  const pengajuan = await getPengajuanById(1);
  const initialData = pengajuan ? [pengajuan] : [];

  const canSubmitProposal = true;

  return (
    <div className="flex w-full flex-col ">
      <div className="flex flex-col p-6 pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="md:text-xl text-2xl font-semibold">
              Pengajuan Judul Anda
            </h2>
            <p className="md:text-xs text-sm text-muted-foreground mt-1">
              Pantau terus ya!
            </p>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mt-4 md:mt-0 self-start">
                <Link
                  href={
                    canSubmitProposal
                      ? "/mahasiswa/pengajuan/tambah-pengajuan"
                      : "#"
                  }
                >
                  <Button
                    disabled={!canSubmitProposal}
                    className="text-white bg-site-header"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline ">Tambah Pengajuan</span>
                    <span className="sm:hidden text-based">Tambah</span>
                  </Button>
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {canSubmitProposal
                  ? "Tambah pengajuan judul baru"
                  : "Pengajuan judul tidak tersedia"}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <TablePengajuan initialData={initialData} />
    </div>
  );
}
