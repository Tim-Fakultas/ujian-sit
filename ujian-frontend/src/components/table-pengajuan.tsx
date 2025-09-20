"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

import { statusColors } from "@/lib/constants";

import { Pengajuan } from "@/types/Pengajuan";

import { formatDate } from "@/lib/utils";

export function TablePengajuan({ initialData }: { initialData?: Pengajuan[] }) {
  // state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Pengajuan | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const itemsPerPage = 5;

  // Define canSubmitProposal - assuming it should always be true for now
  const canSubmitProposal = true;

  // Filter dan search logic
  const filteredData = useMemo(() => {
    return initialData?.filter((item) => {
      const matchesSearch =
        item.mahasiswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.judul_skripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keterangan.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [initialData, searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = (filteredData || []).slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const openDetailDialog = (item: Pengajuan) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";

  return (
    <TooltipProvider>
      <Card className="w-full border-0">
        {/* Card Content */}
        <CardContent className="space-y-4">
          {/* Search dan Filter */}
            <div className="flex gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
              placeholder="Cari berdasarkan nama, judul, atau keterangan..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-10"
              />
              {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
              )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              >
              <SelectTrigger className="w-[160px] sm:w-[160px] w-[120px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="disetujui">Disetujui</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="ditolak">Ditolak</SelectItem>
              </SelectContent>
              </Select>
            </div>
            </div>

          {hasActiveFilters && (
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
              Menampilkan {filteredData?.length || 0} dari{" "}
              {initialData?.length || 0} data
              {searchTerm && ` untuk "${searchTerm}"`}
              {statusFilter !== "all" && ` dengan status "${statusFilter}"`}
            </div>
          )}

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold w-[60px] text-center">
                      No
                    </TableHead>
                    <TableHead className="font-semibold">Judul</TableHead>
                    <TableHead className="font-semibold">Keterangan</TableHead>
                    <TableHead className="font-semibold">
                      Tanggal Pengajuan
                    </TableHead>
                    <TableHead className="font-semibold">
                      Tanggal Verifikasi
                    </TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold w-[80px]">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-12 text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-8 w-8 opacity-50" />
                          <p className="font-medium">
                            Tidak ada data yang ditemukan
                          </p>
                          <p className="text-sm">
                            {hasActiveFilters
                              ? "Coba ubah kriteria pencarian atau filter"
                              : "Belum ada pengajuan yang tersedia"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="text-center font-medium">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate cursor-help">
                                {item.mahasiswa.nama}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-[300px]"
                            >
                              <p>{item.mahasiswa.nama}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate cursor-help">
                                {item.judul_skripsi}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-[300px]"
                            >
                              <p>{item.judul_skripsi}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(item.tanggal_pengajuan)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(item.tanggal_disetujui)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              statusColors[
                                item.status as keyof typeof statusColors
                              ]
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => openDetailDialog(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Lihat detail</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-sm text-muted-foreground order-2 sm:order-1">
                Menampilkan {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredData?.length || 0)}{" "}
                dari {filteredData?.length || 0} data
              </div>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold">
                  Detail Pengajuan
                </DialogTitle>
                {selectedItem && (
                  <Badge
                    variant="outline"
                    className={
                      statusColors[
                        selectedItem.status as keyof typeof statusColors
                      ]
                    }
                  >
                    {selectedItem.status}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-sm text-muted-foreground">
                ID: #{selectedItem?.id.toString().padStart(4, "0")}
              </DialogDescription>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-6 pt-4">
                {/* Mahasiswa */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Mahasiswa
                  </h4>
                  <p className="text-base font-medium">
                    {selectedItem.mahasiswa.nama}
                  </p>
                </div>

                {/* Judul */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Judul Skripsi
                  </h4>
                  <div className="p-3 bg-muted/30 rounded-md border">
                    <p className="text-sm leading-relaxed">
                      {selectedItem.judul_skripsi}
                    </p>
                  </div>
                </div>

                {/* Keterangan */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Keterangan
                  </h4>
                  <div className="p-3 bg-muted/30 rounded-md border">
                    <p className="text-sm leading-relaxed">
                      {selectedItem.keterangan}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Tanggal Pengajuan
                    </h4>
                    <p className="text-sm">
                      {formatDate(selectedItem.tanggal_pengajuan)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Tanggal Verifikasi
                    </h4>
                    <p className="text-sm">
                      {selectedItem.tanggal_disetujui
                        ? formatDate(selectedItem.tanggal_disetujui)
                        : "Belum diverifikasi"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDetailDialogOpen(false)}
                  >
                    Tutup
                  </Button>
                  <Button size="sm" onClick={() => window.print()}>
                    Cetak
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </TooltipProvider>
  );
}
