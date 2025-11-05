"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import { Dosen } from "@/types/Dosen";
import {
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  MoveUp,
  MoveDown,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

interface DosenTableProps {
  dosen: Dosen[];
}

type SortKey = "nama" | "nidn" | "nip" | "prodi";
type SortDirection = "asc" | "desc";

export default function DosenTable({ dosen }: DosenTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("nama");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const pageSize = 10;

  // Sorting logic
  const sortedData = useMemo(() => {
    const sorted = [...dosen].sort((a, b) => {
      let aValue = "";
      let bValue = "";
      if (sortKey === "prodi") {
        aValue = a.prodi?.nama?.toLowerCase() || "";
        bValue = b.prodi?.nama?.toLowerCase() || "";
      } else {
        aValue = (a[sortKey] as string)?.toLowerCase?.() || "";
        bValue = (b[sortKey] as string)?.toLowerCase?.() || "";
      }
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [dosen, sortKey, sortDirection]);

  // Filtered data by search
  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return sortedData.filter(
      (d) =>
        d.nama.toLowerCase().includes(q) ||
        d.nidn?.toLowerCase().includes(q) ||
        d.nip?.toLowerCase().includes(q) ||
        d.prodi?.nama?.toLowerCase().includes(q)
    );
  }, [sortedData, search]);

  const totalPage = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  function renderPagination() {
    if (totalPage <= 1) return null;
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

    const items = [];

    if (start > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (start > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <span className="px-2 text-gray-400">...</span>
          </PaginationItem>
        );
      }
    }

    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={page === i} onClick={() => setPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (end < totalPage) {
      if (end < totalPage - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <span className="px-2 text-gray-400">...</span>
          </PaginationItem>
        );
      }
      items.push(
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

    return items;
  }

  // Sorting handler
  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  }

  function renderSortIcon(key: SortKey) {
    return (
      <span className="flex flex-row items-center ml-1 font-bold ">
        <MoveUp
          size={13}
          className={
            sortKey === key && sortDirection === "asc"
              ? "text-gray-500 "
              : "text-gray-300"
          }
        />
        <MoveDown
          size={13}
          className={
            sortKey === key && sortDirection === "desc"
              ? "text-gray-500 -pl-2"
              : "text-gray-300"
          }
        />
      </span>
    );
  }

  return (
    <div className="bg-white rounded-xl border-neutral-200 shadow p-4 w-full text-xs">
      {/* Search bar */}
      <div className="flex justify-end mb-3 text-xs">
        <div className="relative w-full max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <Input
            placeholder="Cari nama, NIDN, NIP, atau prodi..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 text-xs"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[700px] text-xs">
          <TableHeader>
            <TableRow className="bg-[#F5F7FF]">
              <TableHead className="text-center w-16 font-semibold">
                No
              </TableHead>
              <TableHead
                className="font-semibold cursor-pointer select-none"
                onClick={() => handleSort("nama")}
              >
                <span className="flex items-center gap-1">
                  Nama
                  {renderSortIcon("nama")}
                </span>
              </TableHead>
              <TableHead
                className="font-semibold cursor-pointer select-none"
                onClick={() => handleSort("nidn")}
              >
                <span className="flex items-center gap-1">
                  NIDN
                  {renderSortIcon("nidn")}
                </span>
              </TableHead>
              <TableHead
                className="font-semibold cursor-pointer select-none"
                onClick={() => handleSort("nip")}
              >
                <span className="flex items-center gap-1">
                  NIP
                  {renderSortIcon("nip")}
                </span>
              </TableHead>
              <TableHead
                className="font-semibold cursor-pointer select-none"
                onClick={() => handleSort("prodi")}
              >
                <span className="flex items-center gap-1">
                  Program Studi
                  {renderSortIcon("prodi")}
                </span>
              </TableHead>
              <TableHead className="text-center w-12 font-semibold">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-400"
                >
                  Tidak ada data dosen.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((dosenItem, index) => (
                <TableRow
                  key={dosenItem.id}
                  className={`transition text-xs hover:bg-[#FAFAFC] border-b last:border-b-0 font-normal `}
                >
                  <TableCell className="text-center align-middle text-xs">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="align-middle text-xs">
                    {dosenItem.nama}
                  </TableCell>
                  <TableCell className="align-middle text-xs">
                    {dosenItem.nidn}
                  </TableCell>
                  <TableCell className="align-middle text-xs">
                    {dosenItem.nip}
                  </TableCell>
                  <TableCell className="align-middle text-xs">
                    {dosenItem.prodi?.nama}
                  </TableCell>
                  <TableCell className="text-center align-middle text-xs">
                    <button
                      className="rounded-full p-1 hover:bg-gray-100 transition text-xs"
                      title="Aksi"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPage > 1 && (
        <div className="flex justify-end pt-4 text-xs">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50 text-xs"
                      : "text-xs"
                  }
                />
              </PaginationItem>
              {renderPagination()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                  aria-disabled={page === totalPage}
                  className={
                    page === totalPage
                      ? "pointer-events-none opacity-50 text-xs"
                      : "text-xs"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
