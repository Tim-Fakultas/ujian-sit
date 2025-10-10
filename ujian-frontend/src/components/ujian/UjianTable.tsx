import { FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusColors, statusLabels } from "@/lib/constants";
import { Ujian } from "@/types/Ujian";

interface UjianTableProps {
  data: Ujian[];
  startIndex: number;
  onDetailClick: (ujian: Ujian) => void;
}

export default function UjianTable({
  data,
  startIndex,
  onDetailClick,
}: UjianTableProps) {
  return (
    <div className="bg-white rounded border overflow-x-auto">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">No</TableHead>
            <TableHead>Nama Mahasiswa</TableHead>
            <TableHead>Jenis Ujian</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.nama}</div>
                    <div className="text-sm text-gray-500">{item.nim}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.jenis}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{item.waktu.split(" ")[0]}</div>
                </TableCell>
                <TableCell>
                  <Badge className={`${statusColors[item.status]} border-0`}>
                    {statusLabels[item.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDetailClick(item)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Tidak ada data ujian
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
