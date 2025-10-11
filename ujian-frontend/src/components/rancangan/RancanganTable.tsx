"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {} from "@/components/ui/pagination";
import {} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreVertical } from "lucide-react";
import { RancanganPenelitian } from "@/types/RancanganPenelitian";

const statusColors = {
  menunggu: "bg-orange-100 text-orange-700",
  diverifikasi: "bg-green-100 text-green-700",
  diterima: "bg-blue-100 text-blue-700",
  ditolak: "bg-red-100 text-red-700",
};

const statusLabels = {
  menunggu: "Menunggu",
  diverifikasi: "Diverifikasi",
  diterima: "Diterima",
  ditolak: "Ditolak",
};

interface RancanganTableProps {
  data: RancanganPenelitian[];
  onPreview: (item: RancanganPenelitian) => void;
}

export function RancanganTable({ data, onPreview }: RancanganTableProps) {
  return (
    <div className="bg-white rounded border overflow-x-auto">
      <Table className="w-full">
        {/* header */}
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-12">No</TableHead>
            <TableHead className="max-w-xs">Judul Penelitian</TableHead>
            <TableHead className="w-28">Tanggal Diajukan</TableHead>
            <TableHead className="w-32">Tanggal Diverifikasi</TableHead>
            <TableHead className="w-20">Status</TableHead>
            <TableHead className="w-12">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        {/* body */}
        <TableBody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="max-w-xs truncate text-gray-600">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate cursor-help">
                          {item.judul_penelitian}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-sm">
                        {item.judul_penelitian}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-sm">
                  {item.tanggalPengajuan}
                </TableCell>
                <TableCell className="text-sm">
                  {item.tanggalDiterima || "-"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${statusColors[item.status]} border-0 text-xs`}
                  >
                    {statusLabels[item.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-md">
                      <DropdownMenuItem
                        onClick={() => onPreview(item)}
                        className="cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Tidak ada data rancangan
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
