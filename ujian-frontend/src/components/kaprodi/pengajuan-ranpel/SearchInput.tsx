"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="flex-1 min-w-0 relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search
          size={16}
          className="text-muted-foreground group-focus-within:text-primary transition-colors"
        />
      </div>
      <Input
        placeholder="Cari mahasiswa, judul, atau status..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 focus-visible:ring-primary/20 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-rose-500 transition-colors"
          title="Hapus pencarian"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
