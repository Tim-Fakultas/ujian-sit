"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PDFPreviewModal from "./PDFPreviewModal";
import { Button } from "../ui/button";
import {
  Eye,
  Search,
  ListFilter,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { formatDate, truncateTitle } from "@/lib/utils";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { useState, useMemo, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function PengajuanTableClient({
  pengajuanRanpel,
}: {
  pengajuanRanpel: PengajuanRanpel[];
}) {
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //* Filter
  const [filterStatus, setFilterStatus] = useState<
    "all" | "menunggu" | "diterima" | "ditolak" | "diverifikasi"
  >("all");

  const [search, setSearch] = useState("");

  //* Pagination State
  const [page, setPage] = useState(1);
  const pageSize = 10;

  //* Filtered data
  const filteredData = useMemo(() => {
    return pengajuanRanpel.filter((item) => {
      const nama = item.mahasiswa?.nama?.toLowerCase() ?? "";
      const judul = item.ranpel?.judulPenelitian?.toLowerCase() ?? "";
      const q = search.toLowerCase();
      const matchSearch = nama.includes(q) || judul.includes(q);
      let matchStatus = true;
      if (filterStatus !== "all") {
        matchStatus = item.status === filterStatus;
      }
      return matchSearch && matchStatus;
    });
  }, [pengajuanRanpel, search, filterStatus]);

  //* Pagination
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  //* Reset page ke 1 jika filter berubah
  useEffect(() => {
    setPage(1);
  }, [search, filterStatus]);

  //* Handle Modal Open
  const handleLihatClick = (pengajuan: PengajuanRanpel) => {
    setSelectedPengajuan(pengajuan);
    setIsModalOpen(true);
  };

  //* Handle Modal Close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPengajuan(null);
  };

  return (
    <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h1 className="text-lg font-semibold">Rancangan Penelitian</h1>
        {/* Search & Filter in one row, smaller size */}
        <div className="flex w-full sm:w-auto gap-2 sm:justify-end">
          <div className="relative w-full sm:w-56">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-full  placeholder: rounded-md border  shadow-none focus:ring-0 focus:border-primary bg-white"
            />
          </div>
          {/* Filter status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="px-3 h-9 flex items-center gap-2 border  rounded-md  font-normal shadow-none min-w-[90px] justify-between"
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={13} />
                  Filter
                </span>
                <ChevronDown size={13} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-44 p-0 rounded-md border  shadow"
              sideOffset={8}
            >
              <div className="p-3">
                <div className="font-semibold mb-2 ">Status</div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant={filterStatus === "all" ? "default" : "ghost"}
                    size="sm"
                    className={`justify-start w-full  rounded-md ${
                      filterStatus === "all"
                        ? ""
                        : ""
                    }`}
                    onClick={() => setFilterStatus("all")}
                  >
                    Semua
                  </Button>
                  <Button
                    variant={filterStatus === "menunggu" ? "default" : "ghost"}
                    size="sm"
                    className={`justify-start w-full  rounded-md ${
                      filterStatus === "menunggu"
                        ? ""
                        : ""
                    }`}
                    onClick={() => setFilterStatus("menunggu")}
                  >
                    Menunggu
                  </Button>
                  <Button
                    variant={filterStatus === "diterima" ? "default" : "ghost"}
                    size="sm"
                    className={`justify-start w-full  rounded-md ${
                      filterStatus === "diterima"
                        ? ""
                        : ""
                    }`}
                    onClick={() => setFilterStatus("diterima")}
                  >
                    Diterima
                  </Button>
                  <Button
                    variant={
                      filterStatus === "diverifikasi" ? "default" : "ghost"
                    }
                    size="sm"
                    className={`justify-start w-full  rounded-md ${
                      filterStatus === "diverifikasi"
                        ? ""
                        : ""
                    }`}
                    onClick={() => setFilterStatus("diverifikasi")}
                  >
                    Diverifikasi
                  </Button>
                  <Button
                    variant={filterStatus === "ditolak" ? "default" : "ghost"}
                    size="sm"
                    className={`justify-start w-full  rounded-md ${
                      filterStatus === "ditolak"
                        ? ""
                        : ""
                    }`}
                    onClick={() => setFilterStatus("ditolak")}
                  >
                    Ditolak
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white dark:bg-[#1f1f1f]">
        <Table>
          <TableHeader className="bg-sidebar-accent">
            <TableRow>
              <TableHead className="text-center font-semibold ">No</TableHead>
              <TableHead className="font-semibold ">Nama Mahasiswa</TableHead>
              <TableHead className="font-semibold ">Judul Penelitian</TableHead>
              <TableHead className="font-semibold ">
                Tanggal Pengajuan
              </TableHead>
              <TableHead className="font-semibold ">Status</TableHead>
              <TableHead className=" font-semibold ">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((pengajuan: PengajuanRanpel, index: number) => (
                <TableRow
                  key={pengajuan.id}
                  className="hover:bg-gray-50 transition   "
                >
                  <TableCell className="text-center   ">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="  ">
                    {pengajuan.mahasiswa.nama}
                  </TableCell>
                  <TableCell className="  ">
                    {truncateTitle(pengajuan.ranpel.judulPenelitian)}
                  </TableCell>
                  <TableCell className="  ">
                    {formatDate(pengajuan.tanggalPengajuan)}
                  </TableCell>
                  <TableCell className="">
                    <span
                      className={` rounded px-2 py-1 ${
                        pengajuan.status === "menunggu"
                          ? "bg-yellow-100 text-yellow-800"
                          : pengajuan.status === "diterima"
                          ? "bg-green-100 text-green-800"
                          : pengajuan.status === "ditolak"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {pengajuan.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center ">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 p-0 flex items-center justify-center"
                          aria-label="Aksi"
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={6}
                        className="w-40"
                      >
                        <DropdownMenuItem
                          onClick={() => handleLihatClick(pengajuan)}
                          className="flex items-center gap-2 "
                        >
                          <Eye size={14} />
                          Preview
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-400 italic  "
                >
                  Tidak ada data pengajuan rancangan penelitian.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {/* Custom Pagination with Dots */}
              {(() => {
                const pages = [];
                const maxShown = 5;
                let start = Math.max(1, page - 2);
                let end = Math.min(totalPage, page + 2);

                if (end - start < maxShown - 1) {
                  if (start === 1) {
                    end = Math.min(totalPage, start + maxShown - 1);
                  } else if (end === totalPage) {
                    start = Math.max(1, end - maxShown + 1);
                  }
                }

                // First page
                if (start > 1) {
                  pages.push(
                    <PaginationItem key={1}>
                      <PaginationLink
                        isActive={page === 1}
                        onClick={() => setPage(1)}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                  if (start > 2) {
                    pages.push(
                      <PaginationItem key="start-ellipsis">
                        <span className="px-2 text-gray-400">...</span>
                      </PaginationItem>
                    );
                  }
                }

                // Middle pages
                for (let i = start; i <= end; i++) {
                  pages.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i}
                        onClick={() => setPage(i)}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Last page
                if (end < totalPage) {
                  if (end < totalPage - 1) {
                    pages.push(
                      <PaginationItem key="end-ellipsis">
                        <span className="px-2 text-gray-400">...</span>
                      </PaginationItem>
                    );
                  }
                  pages.push(
                    <PaginationItem key={totalPage}>
                      <PaginationLink
                        isActive={page === totalPage}
                        onClick={() => setPage(totalPage)}
                      >
                        {totalPage}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                return pages;
              })()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                  aria-disabled={page === totalPage}
                  className={
                    page === totalPage ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      {/* PDF Preview Modal */}
      {selectedPengajuan && (
        <PDFPreviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          pengajuan={selectedPengajuan}
        />
      )}
    </div>
  );
}
