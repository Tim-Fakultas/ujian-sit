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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  CheckCircle,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface JudulSkripsi {
  id: number;
  judul: string;
  dosen_pembimbing: string;
  tanggal_diterima: string;
  status: string;
}

// Expanded mock data
const mockData: JudulSkripsi[] = [
  {
    id: 1,
    judul: "Implementasi Machine Learning untuk Prediksi Cuaca",
    dosen_pembimbing: "Dr. Ahmad Surya, M.Kom",
    tanggal_diterima: "2024-01-15",
    status: "Diterima",
  },
  {
    id: 2,
    judul: "Sistem Informasi Manajemen Perpustakaan",
    dosen_pembimbing: "Prof. Siti Nurhaliza, Ph.D",
    tanggal_diterima: "2024-01-20",
    status: "Diterima",
  },
  {
    id: 3,
    judul: "Aplikasi Mobile untuk E-Commerce",
    dosen_pembimbing: "Dr. Budi Santoso, M.T",
    tanggal_diterima: "2024-01-25",
    status: "Diterima",
  },
  {
    id: 4,
    judul: "Sistem Keamanan Jaringan Berbasis AI",
    dosen_pembimbing: "Prof. Maya Indira, Ph.D",
    tanggal_diterima: "2024-02-01",
    status: "Diterima",
  },
  {
    id: 5,
    judul: "Blockchain untuk Supply Chain Management",
    dosen_pembimbing: "Dr. Rudi Hartono, M.Kom",
    tanggal_diterima: "2024-02-05",
    status: "Diterima",
  },
  {
    id: 6,
    judul: "IoT untuk Smart Home Automation",
    dosen_pembimbing: "Prof. Lisa Wijaya, Ph.D",
    tanggal_diterima: "2024-02-10",
    status: "Diterima",
  },
  {
    id: 7,
    judul: "Analisis Big Data untuk Prediksi Pasar Saham",
    dosen_pembimbing: "Dr. Andi Prasetyo, M.Kom",
    tanggal_diterima: "2024-02-15",
    status: "Diterima",
  },
  {
    id: 8,
    judul: "Sistem Rekomendasi Berbasis Collaborative Filtering",
    dosen_pembimbing: "Prof. Dewi Sartika, Ph.D",
    tanggal_diterima: "2024-02-20",
    status: "Diterima",
  },
  {
    id: 9,
    judul: "Aplikasi Augmented Reality untuk Pembelajaran",
    dosen_pembimbing: "Dr. Hendra Kusuma, M.T",
    tanggal_diterima: "2024-02-25",
    status: "Diterima",
  },
  {
    id: 10,
    judul: "Sistem Monitoring Kualitas Udara Real-time",
    dosen_pembimbing: "Prof. Nina Marlina, Ph.D",
    tanggal_diterima: "2024-03-01",
    status: "Diterima",
  },
  {
    id: 11,
    judul: "Chatbot Berbasis Natural Language Processing",
    dosen_pembimbing: "Dr. Farid Wajidi, M.Kom",
    tanggal_diterima: "2024-03-05",
    status: "Diterima",
  },
  {
    id: 12,
    judul: "Sistem Deteksi Fraud Transaksi Bank",
    dosen_pembimbing: "Prof. Ratna Sari, Ph.D",
    tanggal_diterima: "2024-03-10",
    status: "Diterima",
  },
  {
    id: 13,
    judul: "Aplikasi Voice Recognition untuk Kontrol Perangkat",
    dosen_pembimbing: "Dr. Bambang Riyanto, M.T",
    tanggal_diterima: "2024-03-15",
    status: "Diterima",
  },
  {
    id: 14,
    judul: "Sistem Parkir Otomatis Berbasis Computer Vision",
    dosen_pembimbing: "Prof. Ayu Kartika, Ph.D",
    tanggal_diterima: "2024-03-20",
    status: "Diterima",
  },
  {
    id: 15,
    judul: "Platform E-Learning Adaptif dengan AI",
    dosen_pembimbing: "Dr. Eko Prasetio, M.Kom",
    tanggal_diterima: "2024-03-25",
    status: "Diterima",
  },
  {
    id: 16,
    judul: "Sistem Prediksi Kelulusan Mahasiswa",
    dosen_pembimbing: "Prof. Indah Permata, Ph.D",
    tanggal_diterima: "2024-03-30",
    status: "Diterima",
  },
  {
    id: 17,
    judul: "Aplikasi Manajemen Inventory Real-time",
    dosen_pembimbing: "Dr. Joko Susilo, M.T",
    tanggal_diterima: "2024-04-05",
    status: "Diterima",
  },
  {
    id: 18,
    judul: "Sistem Klasifikasi Dokumen Otomatis",
    dosen_pembimbing: "Prof. Sari Dewi, Ph.D",
    tanggal_diterima: "2024-04-10",
    status: "Diterima",
  },
  {
    id: 19,
    judul: "Game Edukasi Berbasis Virtual Reality",
    dosen_pembimbing: "Dr. Wawan Setiawan, M.Kom",
    tanggal_diterima: "2024-04-15",
    status: "Diterima",
  },
  {
    id: 20,
    judul: "Sistem Optimasi Rute Distribusi Barang",
    dosen_pembimbing: "Prof. Rina Maharani, Ph.D",
    tanggal_diterima: "2024-04-20",
    status: "Diterima",
  },
  {
    id: 21,
    judul: "Aplikasi Telemedicine untuk Konsultasi Online",
    dosen_pembimbing: "Dr. Agus Salim, M.T",
    tanggal_diterima: "2024-04-25",
    status: "Diterima",
  },
  {
    id: 22,
    judul: "Sistem Analisis Sentimen Media Sosial",
    dosen_pembimbing: "Prof. Lina Herlina, Ph.D",
    tanggal_diterima: "2024-04-30",
    status: "Diterima",
  },
  {
    id: 23,
    judul: "Platform Crowdsourcing untuk Penelitian",
    dosen_pembimbing: "Dr. Rahmat Hidayat, M.Kom",
    tanggal_diterima: "2024-05-05",
    status: "Diterima",
  },
  {
    id: 24,
    judul: "Sistem Keamanan Biometrik Multi-factor",
    dosen_pembimbing: "Prof. Diana Sari, Ph.D",
    tanggal_diterima: "2024-05-10",
    status: "Diterima",
  },
  {
    id: 25,
    judul: "Aplikasi Smart Farming dengan IoT",
    dosen_pembimbing: "Dr. Yudi Prayoga, M.T",
    tanggal_diterima: "2024-05-15",
    status: "Diterima",
  },
];

export default function JudulDiterimaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<JudulSkripsi | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5; // Reduced for better pagination demo

  

  // Filter dan search logic
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch =
        item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dosen_pembimbing.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const openDetailDialog = (item: JudulSkripsi) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  // Pagination helpers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Generate pagination numbers
  const getPaginationRange = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold">
                  Judul Skripsi Diterima
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Daftar judul skripsi yang telah diterima dan disetujui
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {filteredData.length} Total
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Search Section */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan judul atau dosen pembimbing..."
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
            </div>

            {/* Search Results Summary */}
            {searchTerm && (
              <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                Menampilkan {filteredData.length} dari {mockData.length} hasil
                untuk &quot;{searchTerm}&quot;
              </div>
            )}

            {/* Table */}
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">No</TableHead>
                      <TableHead className="font-semibold min-w-[250px]">
                        Judul Skripsi
                      </TableHead>
                      <TableHead className="font-semibold min-w-[200px]">
                        Dosen Pembimbing
                      </TableHead>
                      <TableHead className="font-semibold">
                        Tanggal Diterima
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
                          colSpan={6}
                          className="text-center py-12 text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Search className="h-8 w-8 opacity-50" />
                            <p className="font-medium">
                              {searchTerm
                                ? "Tidak ada data yang sesuai dengan pencarian"
                                : "Belum ada judul skripsi yang diterima"}
                            </p>
                            {searchTerm && (
                              <Button
                                variant="link"
                                onClick={clearSearch}
                                className="text-primary text-sm"
                              >
                                Hapus filter pencarian
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((item, index) => (
                        <TableRow
                          key={item.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {startIndex + index + 1}
                          </TableCell>
                          <TableCell className="max-w-[250px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="font-medium leading-relaxed cursor-help">
                                  {item.judul}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="max-w-[300px]"
                              >
                                <p>{item.judul}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-muted-foreground">
                              {item.dosen_pembimbing}
                            </div>
                          </TableCell>
                          <TableCell>
                            <time className="text-muted-foreground text-sm">
                              {formatDate(item.tanggal_diterima)}
                            </time>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
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

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Menampilkan {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, filteredData.length)}{" "}
                  dari {filteredData.length} data
                  {searchTerm && (
                    <span className="block sm:inline sm:ml-1">
                      (difilter dari {mockData.length} total)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 order-1 sm:order-2">
                  {/* First page */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Halaman pertama</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Previous page */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Halaman sebelumnya</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {getPaginationRange().map((page, index) => (
                      <div key={index}>
                        {page === "..." ? (
                          <span className="px-2 py-1 text-sm text-muted-foreground">
                            ...
                          </span>
                        ) : (
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page as number)}
                            className="h-8 w-8 p-0"
                          >
                            {page}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Next page */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Halaman selanjutnya</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Last page */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Halaman terakhir</p>
                    </TooltipContent>
                  </Tooltip>
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
                    Detail Judul Skripsi
                  </DialogTitle>
                  {selectedItem && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {selectedItem.status}
                    </Badge>
                  )}
                </div>
                <DialogDescription className="text-sm text-muted-foreground">
                  ID: #{selectedItem?.id.toString().padStart(4, '0')}
                </DialogDescription>
              </DialogHeader>
              
              {selectedItem && (
                <div className="space-y-6 pt-4">
                  {/* Judul */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Judul Skripsi
                    </h4>
                    <div className="p-3 bg-muted/30 rounded-md border">
                      <p className="text-sm leading-relaxed">
                        {selectedItem.judul}
                      </p>
                    </div>
                  </div>

                  {/* Dosen Pembimbing */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Dosen Pembimbing
                    </h4>
                    <p className="text-base font-medium">
                      {selectedItem.dosen_pembimbing}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Tanggal Diterima
                      </h4>
                      <p className="text-sm">
                        {formatDate(selectedItem.tanggal_diterima)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Status
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {selectedItem.status}
                      </Badge>
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
                    <Button
                      size="sm"
                      onClick={() => window.print()}
                    >
                      Cetak
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </TooltipProvider>
  );
}
