"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { rancanganData } from "@/lib/constants";
import { PDFDocument } from "@/components/PDFDocument";

const statusColors = {
  pending: "bg-orange-100 text-orange-700",
  disetujui: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
};

const statusLabels = {
  pending: "Menunggu Persetujuan",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
};

// Mock student and supervisor data - in real app this would come from API
const studentData = [
  {
    id: 1,
    name: "Ahmad Rizki",
    nim: "2021001",
    supervisor: "Dr. Ahmad Rahman M.Kom",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    nim: "2021002",
    supervisor: "Indah Hidayanti M.Kom",
  },
  {
    id: 3,
    name: "Budi Santoso",
    nim: "2021003",
    supervisor: "Dr. Sari Wulandari M.T",
  },
];

export default function KaprodiPengajuanRanpelPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selected, setSelected] = useState<Rancangan | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [approvalDialog, setApprovalDialog] = useState<{
    item: Rancangan;
    action: "approve" | "reject";
  } | null>(null);
  const [approvalNote, setApprovalNote] = useState("");

  const filteredData = rancanganData.filter((item) => {
    const matchSearch = item.judul.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeTab === "all" ? true : item.status === activeTab;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStudentNim = (id: number) => {
    const student = studentData.find((s) => s.id === id);
    return student ? student.nim : "N/A";
  };

  const getStudentName = (id: number) => {
    const student = studentData.find((s) => s.id === id);
    return student ? student.name : "Mahasiswa Tidak Ditemukan";
  };

  const getSupervisor = (id: number) => {
    const student = studentData.find((s) => s.id === id);
    return student ? student.supervisor : "Dosen Tidak Ditemukan";
  };

  const handleApproval = (action: "approve" | "reject") => {
    // Here you would typically send the approval/rejection to your API
    console.log(`${action} proposal:`, approvalDialog?.item.id, approvalNote);
    setApprovalDialog(null);
    setApprovalNote("");
  };

  const handleDownloadPDF = async () => {
    if (!selected) return;

    setIsDownloading(true);
    try {
      const studentName = getStudentName(selected.id);
      const studentNim = getStudentNim(selected.id);
      const filename = `Rancangan_Penelitian_${studentName.replace(
        /\s+/g,
        "_"
      )}_${studentNim}.pdf`;

      await generatePDF("pdf-content", filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal mengunduh PDF. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Convert data format for PDFDocument component
  const getConvertedRancangan = (item: Rancangan) => {
    return {
      ...item,
      mahasiswa: {
        nama: getStudentName(item.id),
        nim: getStudentNim(item.id),
      },
      dosenPA: {
        nama: getSupervisor(item.id),
        nip: "198505152010121002", // Default NIP, bisa diambil dari data
      },
    };
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Review Rancangan Penelitian Mahasiswa
            </h1>
            <p className="text-gray-600 mt-1">
              Tinjau dan setujui rancangan penelitian mahasiswa Program Studi
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari judul penelitian..."
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "all"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Semua ({rancanganData.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "pending"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Menunggu Persetujuan (
              {rancanganData.filter((i) => i.status === "pending").length})
            </button>
            <button
              onClick={() => setActiveTab("disetujui")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "disetujui"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Disetujui (
              {rancanganData.filter((i) => i.status === "disetujui").length})
            </button>
            <button
              onClick={() => setActiveTab("ditolak")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "ditolak"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Ditolak (
              {rancanganData.filter((i) => i.status === "ditolak").length})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-16">No</TableHead>
                <TableHead className="w-48">Mahasiswa</TableHead>
                <TableHead className="min-w-0">Judul Penelitian</TableHead>
                <TableHead className="w-48">Dosen Pembimbing</TableHead>
                <TableHead className="w-32">Tanggal Diajukan</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-20">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="text-gray-600 font-medium">
                      {getStudentName(item.id)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="truncate cursor-help max-w-xs">
                              {item.judul}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-sm">
                            {item.judul}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {getSupervisor(item.id)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.tanggalDiajukan}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          statusColors[item.status]
                        } border-0 text-xs`}
                      >
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelected(item)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          {item.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  setApprovalDialog({
                                    item,
                                    action: "approve",
                                  })
                                }
                                className="text-green-600 focus:text-green-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Setujui
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setApprovalDialog({
                                    item,
                                    action: "reject",
                                  })
                                }
                                className="text-red-600 focus:text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Tolak
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Tidak ada data rancangan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Footer Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm">Tampil per halaman:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(v) => {
                  setItemsPerPage(parseInt(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20 rounded">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          className="rounded"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
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
                    <PDFDocument
                      rancangan={getConvertedRancangan(selected)}
                      id="pdf-content"
                    />
                  </div>
                </div>

                <DialogFooter className="flex justify-between ">
                  {/* Tombol kiri: Tutup & Download */}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelected(null)}>
                      Tutup
                    </Button>
                    <Button
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isDownloading ? "Mengunduh..." : "Download PDF"}
                    </Button>
                  </div>

                  {/* Tombol kanan: Approve / Reject */}
                  {selected.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() =>
                          setApprovalDialog({
                            item: selected,
                            action: "reject",
                          })
                        }
                      >
                        Tolak
                      </Button>
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() =>
                          setApprovalDialog({
                            item: selected,
                            action: "approve",
                          })
                        }
                      >
                        Setujui
                      </Button>
                    </div>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Approval Dialog */}
        <Dialog
          open={!!approvalDialog}
          onOpenChange={() => setApprovalDialog(null)}
        >
          <DialogContent className="sm:max-w-lg rounded">
            {approvalDialog && (
              <>
                <DialogHeader>
                  <DialogTitle>
                    {approvalDialog.action === "approve" ? "Setujui" : "Tolak"}{" "}
                    Rancangan Penelitian
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <label className="text-sm font-medium">NIM</label>
                    <Input
                      value={getStudentNim(approvalDialog.item.id)}
                      readOnly
                      className="mt-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Nama Mahasiswa
                    </label>
                    <Input
                      value={getStudentName(approvalDialog.item.id)}
                      readOnly
                      className="mt-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Judul</label>
                    <Textarea
                      value={approvalDialog.item.judul}
                      readOnly
                      className="mt-1 rounded"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Catatan{" "}
                      {approvalDialog.action === "approve"
                        ? "Persetujuan"
                        : "Penolakan"}
                    </label>
                    <Textarea
                      placeholder={
                        approvalDialog.action === "approve"
                          ? "Berikan catatan persetujuan (opsional)..."
                          : "Berikan alasan penolakan..."
                      }
                      value={approvalNote}
                      onChange={(e) => setApprovalNote(e.target.value)}
                      className="mt-1 rounded"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setApprovalDialog(null)}
                  >
                    Batal
                  </Button>
                  <Button
                    className={
                      approvalDialog.action === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }
                    variant={
                      approvalDialog.action === "reject"
                        ? "destructive"
                        : "default"
                    }
                    onClick={() => handleApproval(approvalDialog.action)}
                  >
                    {approvalDialog.action === "approve" ? "Setujui" : "Tolak"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
