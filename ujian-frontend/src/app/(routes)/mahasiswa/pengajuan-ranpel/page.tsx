"use client";

import { useState } from "react";
import {
  RancanganForm,
  RancanganTable,
  RancanganPreview,
  SearchBar,
} from "@/components/rancangan";
import { RancanganPenelitian } from "@/types/RancanganPenelitian";

export default function DaftarRancanganPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<RancanganPenelitian | null>(null);

  const handlePreview = (item: RancanganPenelitian) => {
    setSelected(item);
  };

  const handleClosePreview = () => {
    setSelected(null);
  };

  const handleFormSubmitSuccess = () => {
    // Refresh data or perform any action after successful form submission
    console.log("Form submitted successfully");
  };

  // DATA DUMMY UNTUK RANCANGAN PENELITIAN
  const rancanganPenelitian: RancanganPenelitian[] = [
    {
      id: 1,
      judul_penelitian:
        "Analisis Pengaruh Media Sosial terhadap Perilaku Konsumen",
      masalah_dan_penyebab:
        "Banyaknya penggunaan media sosial yang mempengaruhi keputusan pembelian konsumen.",
      alternatif_solusi:
        "Melakukan survei dan wawancara untuk memahami pengaruh media sosial.",
      metode_penelitian: "Metode kuantitatif dengan menggunakan kuesioner.",
      hasil_yang_diharapkan:
        "Memahami sejauh mana media sosial mempengaruhi perilaku konsumen.",
      kebutuhan_data:
        "Data dari pengguna media sosial dan perilaku pembelian mereka.",
      status: "menunggu",
      tanggalPengajuan: "2023-10-01",
    },
    {
      id: 2,
      judul_penelitian: "Studi Efektivitas Pembelajaran Daring di Masa Pandemi",
      masalah_dan_penyebab:
        "Tantangan dalam pembelajaran daring yang mempengaruhi hasil belajar siswa.",
      alternatif_solusi:
        "Menganalisis metode pembelajaran daring yang paling efektif.",
      metode_penelitian: "Metode campuran dengan survei dan wawancara.",
      hasil_yang_diharapkan:
        "Menemukan strategi pembelajaran daring yang efektif.",
      kebutuhan_data:
        "Data dari siswa, guru, dan hasil belajar selama pembelajaran daring.",
      status: "diterima",
      tanggalPengajuan: "2023-09-15",
      tanggalDiterima: "2023-09-30",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Rancangan Penelitian
            </h1>
            <p className="text-gray-600 mt-1">Rancangan penelitian Anda</p>
          </div>
          <RancanganForm onSubmitSuccess={handleFormSubmitSuccess} />
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <SearchBar search={search} onSearchChange={setSearch} />
        </div>

        {/* Table */}
        <RancanganTable 
          data={rancanganPenelitian}
  
          onPreview={handlePreview}
        />

        {/* Preview Dialog */}
        <RancanganPreview selected={selected} onClose={handleClosePreview} />
        
      </div>
    </div>
  );
}
