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
import { Search } from "lucide-react";
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
import { User } from "@/types/Auth";

interface DosenTableProps {
  dosen: Dosen[];
  user: User;
}

export default function DosenTable({ dosen, user }: DosenTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return dosen.filter(
      (d) =>
        d.nama.toLowerCase().includes(q) ||
        d.nidn?.toLowerCase().includes(q) ||
        d.nip?.toLowerCase().includes(q) ||
        d.prodi?.nama?.toLowerCase().includes(q)
    );
  }, [dosen, search]);

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

  return (
    <div className="rounded-lg overflow-x-auto bg-white dark:bg-[#1f1f1f] p-6">
      {/* Search bar kanan atas */}

      <div className="flex justify-between mb-3">
        <div>
          <span className="font-semibold text-lg">Dosen</span>
          <p className="text-xs text-gray-500">{user.prodi?.nama_prodi}</p>
        </div>

        <div className="relative w-56">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} className="text-gray-400" />
          </span>
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 border border-gray-400 bg-transparent text-gray-100 placeholder:text-gray-300 rounded-lg focus:border-gray-300 focus:ring-0"
          />
        </div>
      </div>

      <div className="border overflow-auto rounded-lg">
        <Table>
          <TableHeader className="bg-sidebar-accent">
            <TableRow>
              <TableHead className="text-center w-10 font-semibold">
                No
              </TableHead>
              <TableHead className="font-semibold">Nama</TableHead>
              <TableHead className="font-semibold">NIDN</TableHead>
              <TableHead className="font-semibold">NIP</TableHead>
              <TableHead className="font-semibold">Program Studi</TableHead>
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
                  className="hover:bg-gray-50 transition  border-b last:border-b-0 font-normal"
                >
                  <TableCell className="text-center align-middle ">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="align-middle ">
                    {dosenItem.nama}
                  </TableCell>
                  <TableCell className="align-middle ">
                    {dosenItem.nidn}
                  </TableCell>
                  <TableCell className="align-middle ">
                    {dosenItem.nip}
                  </TableCell>
                  <TableCell className="align-middle ">
                    {dosenItem.prodi?.nama}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPage > 1 && (
        <div className="mt-4 flex justify-end ">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                  className={
                    page === 1 ? "pointer-events-none opacity-50 " : ""
                  }
                />
              </PaginationItem>
              {renderPagination()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                  aria-disabled={page === totalPage}
                  className={
                    page === totalPage ? "pointer-events-none opacity-50 " : ""
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
