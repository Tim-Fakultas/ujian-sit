"use client";
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

interface Pengajuan {
  id: string;
  judul: string;
  mahasiswa: string;
  nim: string;
  tanggalPengajuan: string;
  status: "pending" | "diterima" | "ditolak";
  identifikasiMasalah: string;
  rumusanMasalah: string;
  pokokMasalah: string;
  penelitianSebelumnya: string;
  deskripsiLengkap: string;
  keterangan?: string;
}

const statusColors = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  diterima:
    "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800",
  ditolak:
    "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800",
};

export default function DaftarPengajuanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPengajuan, setSelectedPengajuan] = useState<Pengajuan | null>(
    null
  );
  const [keterangan, setKeterangan] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"terima" | "tolak" | "detail">(
    "detail"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const itemsPerPage = 5;

  // Mock data
  const [pengajuanList, setPengajuanList] = useState<Pengajuan[]>([
    {
      id: "1",
      judul: "Implementasi Machine Learning untuk Prediksi Harga Saham",
      mahasiswa: "Ahmad Rizki",
      nim: "20210001",
      tanggalPengajuan: "2024-01-15",
      status: "pending",
      identifikasiMasalah:
        "Volatilitas harga saham yang tinggi menyulitkan investor dalam mengambil keputusan investasi yang tepat. Metode analisis tradisional seringkali tidak akurat dalam memprediksi pergerakan harga saham.",
      rumusanMasalah:
        "Bagaimana cara mengimplementasikan algoritma machine learning untuk meningkatkan akurasi prediksi harga saham berdasarkan data historis dan faktor ekonomi?",
      pokokMasalah:
        "Pengembangan model prediksi harga saham menggunakan algoritma deep learning dengan tingkat akurasi yang lebih baik dibandingkan metode konvensional.",
      penelitianSebelumnya:
        "Penelitian oleh Zhang et al. (2023) menunjukkan bahwa LSTM dapat meningkatkan akurasi prediksi hingga 85%. Namun, penelitian tersebut belum mengintegrasikan faktor ekonomi makro.",
      deskripsiLengkap:
        "Penelitian ini akan menggunakan algoritma deep learning seperti LSTM dan GRU untuk memprediksi pergerakan harga saham dengan menganalisis data historis dan faktor-faktor ekonomi yang mempengaruhi pasar. Dataset yang digunakan mencakup data harga saham 5 tahun terakhir dari BEI.",
    },
    {
      id: "2",
      judul: "Sistem Informasi Manajemen Perpustakaan Berbasis Web",
      mahasiswa: "Siti Nurhaliza",
      nim: "20210002",
      tanggalPengajuan: "2024-01-14",
      status: "diterima",
      identifikasiMasalah:
        "Sistem manajemen perpustakaan yang masih manual menyebabkan inefisiensi dalam pengelolaan data buku, anggota, dan transaksi peminjaman.",
      rumusanMasalah:
        "Bagaimana merancang dan membangun sistem informasi manajemen perpustakaan berbasis web yang dapat meningkatkan efisiensi operasional perpustakaan?",
      pokokMasalah:
        "Pengembangan sistem informasi terintegrasi untuk otomatisasi proses manajemen perpustakaan dari pendaftaran anggota hingga pelaporan.",
      penelitianSebelumnya:
        "Sistem serupa telah dikembangkan oleh Rahayu (2022) namun terbatas pada fitur basic. Penelitian ini akan menambahkan fitur advanced seperti recommendation system.",
      deskripsiLengkap:
        "Pengembangan sistem informasi untuk mengelola data buku, anggota, dan transaksi peminjaman di perpustakaan menggunakan teknologi web modern seperti React dan Node.js dengan database MySQL.",
      keterangan: "Topik sangat relevan dan metodologi penelitian sudah jelas.",
    },
    {
      id: "3",
      judul: "Analisis Keamanan Jaringan WiFi Menggunakan Penetration Testing",
      mahasiswa: "Budi Santoso",
      nim: "20210003",
      tanggalPengajuan: "2024-01-13",
      status: "ditolak",
      identifikasiMasalah:
        "Kerentanan keamanan pada jaringan WiFi dapat dieksploitasi oleh pihak yang tidak bertanggung jawab untuk mengakses data sensitif.",
      rumusanMasalah:
        "Bagaimana mengidentifikasi dan menganalisis kerentanan keamanan jaringan WiFi menggunakan teknik penetration testing?",
      pokokMasalah:
        "Evaluasi tingkat keamanan jaringan WiFi dan penyusunan rekomendasi peningkatan keamanan berdasarkan hasil penetration testing.",
      penelitianSebelumnya:
        "Penelitian tentang WiFi security telah banyak dilakukan, namun fokus pada tools spesifik seperti yang diusulkan masih terbatas.",
      deskripsiLengkap:
        "Penelitian mengenai kerentanan keamanan pada jaringan WiFi dan teknik-teknik penetration testing untuk mengidentifikasi celah keamanan menggunakan tools seperti Kali Linux dan Metasploit.",
      keterangan:
        "Topik terlalu umum, perlu fokus yang lebih spesifik pada metodologi atau tools tertentu.",
    },
    {
      id: "4",
      judul: "Pengembangan Aplikasi Mobile E-Commerce dengan React Native",
      mahasiswa: "Dewi Sartika",
      nim: "20210004",
      tanggalPengajuan: "2024-01-12",
      status: "pending",
      identifikasiMasalah:
        "Pertumbuhan e-commerce mobile yang pesat membutuhkan platform yang user-friendly dan memiliki performa tinggi.",
      rumusanMasalah:
        "Bagaimana mengembangkan aplikasi mobile e-commerce yang responsif dan memiliki user experience yang baik menggunakan React Native?",
      pokokMasalah:
        "Implementasi fitur lengkap e-commerce mobile termasuk katalog produk, payment gateway, dan sistem notifikasi real-time.",
      penelitianSebelumnya:
        "Aplikasi e-commerce mobile telah banyak dikembangkan, namun penelitian khusus pada optimisasi performance React Native masih terbatas.",
      deskripsiLengkap:
        "Membuat aplikasi mobile untuk platform e-commerce dengan fitur lengkap menggunakan React Native dan backend Node.js, termasuk integrasi payment gateway dan push notification.",
    },
    {
      id: "5",
      judul: "Implementasi Blockchain untuk Sistem Voting Digital",
      mahasiswa: "Eko Prasetyo",
      nim: "20210005",
      tanggalPengajuan: "2024-01-11",
      status: "pending",
      identifikasiMasalah:
        "Sistem voting tradisional rentan terhadap manipulasi dan kurang transparan, sehingga diperlukan sistem yang lebih aman dan dapat diverifikasi.",
      rumusanMasalah:
        "Bagaimana mengimplementasikan teknologi blockchain untuk menciptakan sistem voting digital yang aman, transparan, dan dapat diverifikasi?",
      pokokMasalah:
        "Pengembangan prototype sistem voting berbasis blockchain dengan smart contract untuk menjamin integritas dan transparansi proses voting.",
      penelitianSebelumnya:
        "Beberapa implementasi blockchain voting telah dilakukan di Estonia dan pilot project lainnya menunjukkan potensi teknologi ini.",
      deskripsiLengkap:
        "Penelitian implementasi teknologi blockchain untuk menciptakan sistem voting digital yang aman dan transparan menggunakan Ethereum smart contracts dan web3 technologies.",
    },
    {
      id: "6",
      judul:
        "Analisis Sentimen Media Sosial Menggunakan Natural Language Processing",
      mahasiswa: "Fitri Handayani",
      nim: "20210006",
      tanggalPengajuan: "2024-01-10",
      status: "diterima",
      identifikasiMasalah:
        "Volume data media sosial yang besar menyulitkan analisis manual terhadap opini publik, diperlukan sistem otomatis untuk analisis sentimen.",
      rumusanMasalah:
        "Bagaimana mengembangkan sistem analisis sentimen yang akurat untuk data media sosial berbahasa Indonesia menggunakan teknik NLP?",
      pokokMasalah:
        "Implementasi algoritma NLP untuk klasifikasi sentimen dengan tingkat akurasi tinggi pada teks berbahasa Indonesia informal.",
      penelitianSebelumnya:
        "Analisis sentimen bahasa Inggris sudah mature, namun untuk bahasa Indonesia dengan karakteristik bahasa informal media sosial masih memerlukan penelitian lanjutan.",
      deskripsiLengkap:
        "Mengembangkan sistem analisis sentimen untuk data media sosial menggunakan teknik NLP dan machine learning dengan fokus pada preprocessing teks bahasa Indonesia dan feature extraction yang optimal.",
      keterangan: "Topik menarik dan memiliki potensi aplikasi yang baik.",
    },
  ]);

  // Filter dan search logic
  const filteredData = useMemo(() => {
    return pengajuanList.filter((item) => {
      const matchesSearch =
        item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mahasiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nim.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, pengajuanList]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAction = (
    pengajuan: Pengajuan,
    action: "terima" | "tolak" | "detail"
  ) => {
    setSelectedPengajuan(pengajuan);
    setActionType(action);
    setKeterangan(pengajuan.keterangan || "");
    setIsDialogOpen(true);
  };

  const handleSubmitAction = () => {
    if (!selectedPengajuan) return;

    setPengajuanList((prev) =>
      prev.map((item) =>
        item.id === selectedPengajuan.id
          ? {
              ...item,
              status:
                actionType === "terima"
                  ? "diterima"
                  : actionType === "tolak"
                  ? "ditolak"
                  : item.status,
              keterangan,
            }
          : item
      )
    );

    setIsDialogOpen(false);
    setKeterangan("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";

  return (
    <TooltipProvider>
      <div className="container mx-auto py-4 px-4 max-w-7xl">
        <Card className="w-full border-0">
          <CardHeader className="pb-4">
            <CardTitle>
              <div>
                <h2 className="text-xl font-semibold">Daftar Pengajuan</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Kelola dan review pengajuan skripsi mahasiswa
                </p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Search dan Filter */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan judul, nama mahasiswa, atau NIM..."
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
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="diterima">Diterima</SelectItem>
                    <SelectItem value="ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="px-3"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Hapus semua filter</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Status summary */}
            {hasActiveFilters && (
              <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                Menampilkan {filteredData.length} dari {pengajuanList.length}{" "}
                data
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
                      <TableHead className="font-semibold">Judul</TableHead>
                      <TableHead className="font-semibold">
                        Nama Mahasiswa
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">
                        Tanggal Pengajuan
                      </TableHead>
                      <TableHead className="font-semibold w-[120px]">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
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
                      paginatedData.map((pengajuan) => (
                        <TableRow
                          key={pengajuan.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="max-w-[250px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="truncate cursor-help font-medium">
                                  {pengajuan.judul}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="max-w-[300px]"
                              >
                                <p>{pengajuan.judul}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {pengajuan.mahasiswa}
                            </div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {pengajuan.nim}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={statusColors[pengajuan.status]}
                            >
                              {pengajuan.status === "pending"
                                ? "Menunggu"
                                : pengajuan.status === "diterima"
                                ? "Diterima"
                                : "Ditolak"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(pengajuan.tanggalPengajuan)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleAction(pengajuan, "detail")
                                    }
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Lihat detail</p>
                                </TooltipContent>
                              </Tooltip>

                              {pengajuan.status === "pending" && (
                                <>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleAction(pengajuan, "terima")
                                        }
                                        className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Terima pengajuan</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          handleAction(pengajuan, "tolak")
                                        }
                                        className="h-8 w-8 p-0"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Tolak pengajuan</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </>
                              )}
                            </div>
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
                  {Math.min(startIndex + itemsPerPage, filteredData.length)}{" "}
                  dari {filteredData.length} data
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
        </Card>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {actionType === "detail"
                  ? "Detail Pengajuan"
                  : actionType === "terima"
                  ? "Terima Pengajuan"
                  : "Tolak Pengajuan"}
              </DialogTitle>
              <DialogDescription className="line-clamp-2">
                {selectedPengajuan?.judul}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Nama Mahasiswa
                  </Label>
                  <p className="mt-1">
                    {selectedPengajuan?.mahasiswa} ({selectedPengajuan?.nim})
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <div className="mt-1">
                    {selectedPengajuan && (
                      <Badge
                        variant="outline"
                        className={statusColors[selectedPengajuan.status]}
                      >
                        {selectedPengajuan.status === "pending"
                          ? "Menunggu"
                          : selectedPengajuan.status === "diterima"
                          ? "Diterima"
                          : "Ditolak"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Judul
                </Label>
                <p className="text-sm leading-relaxed">
                  {selectedPengajuan?.judul}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Identifikasi Masalah
                </Label>
                <p className="text-sm leading-relaxed">
                  {selectedPengajuan?.identifikasiMasalah}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Rumusan Masalah
                </Label>
                <p className="text-sm leading-relaxed">
                  {selectedPengajuan?.rumusanMasalah}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Pokok Masalah
                </Label>
                <p className="text-sm leading-relaxed">
                  {selectedPengajuan?.pokokMasalah}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Penelitian Sebelumnya
                </Label>
                <p className="text-sm leading-relaxed">
                  {selectedPengajuan?.penelitianSebelumnya}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Deskripsi Lengkap
                </Label>
                <p className="text-sm leading-relaxed">
                  {selectedPengajuan?.deskripsiLengkap}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keterangan">
                  {actionType === "detail"
                    ? "Keterangan"
                    : "Keterangan (wajib diisi)"}
                </Label>
                <Textarea
                  id="keterangan"
                  placeholder={
                    actionType === "terima"
                      ? "Berikan keterangan mengapa pengajuan ini diterima..."
                      : actionType === "tolak"
                      ? "Berikan keterangan mengapa pengajuan ini ditolak dan saran perbaikan..."
                      : "Keterangan dari dosen pembimbing..."
                  }
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  disabled={actionType === "detail"}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {actionType === "detail" ? "Tutup" : "Batal"}
              </Button>
              {actionType !== "detail" && (
                <Button
                  onClick={handleSubmitAction}
                  disabled={!keterangan.trim()}
                  className={
                    actionType === "terima"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                  variant={actionType === "tolak" ? "destructive" : "default"}
                >
                  {actionType === "terima"
                    ? "Terima Pengajuan"
                    : "Tolak Pengajuan"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
