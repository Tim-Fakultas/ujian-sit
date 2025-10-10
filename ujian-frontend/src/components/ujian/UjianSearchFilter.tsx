import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconFilter2 } from "@tabler/icons-react";

interface UjianSearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  examTypeFilter: string;
  onExamTypeFilterChange: (value: string) => void;
}

export default function UjianSearchFilter({
  search,
  onSearchChange,
  examTypeFilter,
  onExamTypeFilterChange,
}: UjianSearchFilterProps) {
  return (
    <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search"
          className="pl-10 border-gray-200 bg-white rounded"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={examTypeFilter} onValueChange={onExamTypeFilterChange}>
        <SelectTrigger className="w-42 bg-white rounded">
          <IconFilter2 className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter jenis ujian" />
        </SelectTrigger>
        <SelectContent className="rounded">
          <SelectItem value="all">Semua Jenis</SelectItem>
          <SelectItem value="Seminar Proposal">Seminar Proposal</SelectItem>
          <SelectItem value="Seminar Hasil">Seminar Hasil</SelectItem>
          <SelectItem value="Seminar Skripsi">Seminar Skripsi</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
