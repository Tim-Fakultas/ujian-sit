import { useState, useMemo } from "react";
import { ujianData } from "@/lib/constants";
import { Ujian } from "@/types/Ujian";

export function useUjianData() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [examTypeFilter, setExamTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedUjian, setSelectedUjian] = useState<Ujian | null>(null);

  const filteredData = useMemo(() => {
    return ujianData.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.nim.toLowerCase().includes(search.toLowerCase()) ||
        item.judul.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        activeTab === "all" ? true : item.status === activeTab;
      const matchExamType =
        examTypeFilter === "all" ? true : item.jenis === examTypeFilter;

      return matchSearch && matchStatus && matchExamType;
    });
  }, [search, activeTab, examTypeFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  return {
    // State
    search,
    activeTab,
    examTypeFilter,
    currentPage,
    itemsPerPage,
    selectedUjian,

    // Computed data
    filteredData,
    currentData,
    totalPages,
    startIndex,

    // Actions
    setSearch,
    setActiveTab,
    setExamTypeFilter,
    setCurrentPage,
    setSelectedUjian,
    handleItemsPerPageChange,
  };
}
