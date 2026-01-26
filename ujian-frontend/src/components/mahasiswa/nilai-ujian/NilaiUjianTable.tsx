/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getAllDosen } from "@/actions/data-master/dosen";
import { getAllUsers } from "@/actions/user";

import { BeritaUjian } from "@/types/BeritaUjian";
import { Button } from "../../ui/button";
import {
  X,
  Search,
  MoreHorizontal,
  Check,
  LayoutGrid,
  List,
  Settings2,
  Calendar,
  AlertCircle,
  Eye,
  Download,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableGlobal from "@/components/tableGlobal";
import { DataCard } from "@/components/common/DataCard";
import { getPenilaianByUjianId } from "@/actions/penilaian";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NilaiUjianTable({
  ujian,
}: {
  ujian: BeritaUjian[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<BeritaUjian | null>(null);
  const [penilaian, setPenilaian] = useState<any[]>([]);

  // State untuk modal catatan
  const [openCatatanDialog, setOpenCatatanDialog] = useState(false);
  const [selectedCatatan, setSelectedCatatan] = useState<string>("");

  // Ambil penilaian ketika modal detail dibuka
  useEffect(() => {
    if (openDialog && selected?.id) {
      getPenilaianByUjianId(selected.id).then((data) => setPenilaian(data));
    }
  }, [openDialog, selected?.id]);

  // Tambah state untuk search
  const [search, setSearch] = useState("");
  // Tambah state untuk filter jenis ujian
  const [jenisFilter, setJenisFilter] = useState<
    "all" | "proposal" | "hasil" | "skripsi"
  >("all");

  const [hasilFilter, setHasilFilter] = useState<
    "all" | "lulus" | "tidak lulus"
  >("all");

  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Tambah state untuk filter bulan dan tahun
  const [filterBulan, setFilterBulan] = useState<string>("all");
  const [filterTahun, setFilterTahun] = useState<string>("all");

  // ... filtering logic (same as before) ...
  const filteredData = ujian.filter((item) => {
    const nama = item.mahasiswa?.nama?.toLowerCase() ?? "";
    const judul = item.judulPenelitian?.toLowerCase() ?? "";
    const q = search.toLowerCase();
    const matchSearch = nama.includes(q) || judul.includes(q);

    let matchJenis = true;
    if (jenisFilter !== "all") {
      const jenis = item.jenisUjian?.namaJenis?.toLowerCase() ?? "";
      matchJenis = jenis.includes(jenisFilter);
    }

    let matchHasil = true;
    if (hasilFilter !== "all") {
      matchHasil = (item.hasil?.toLowerCase() ?? "") === hasilFilter;
    }

    // Filter bulan
    let matchBulan = true;
    if (filterBulan !== "all") {
      if (!item.jadwalUjian) matchBulan = false;
      else {
        const bulan = String(new Date(item.jadwalUjian).getMonth() + 1);
        matchBulan = bulan === filterBulan;
      }
    }
    // Filter tahun
    let matchTahun = true;
    if (filterTahun !== "all") {
      if (!item.jadwalUjian) matchTahun = false;
      else {
        const tahun = String(new Date(item.jadwalUjian).getFullYear());
        matchTahun = tahun === filterTahun;
      }
    }
    return matchSearch && matchJenis && matchHasil && matchBulan && matchTahun;
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Reset page ke 1 saat search atau filter berubah
  useEffect(() => {
    setPage(1);
  }, [search, jenisFilter, hasilFilter, filterBulan, filterTahun]);

  const handleDetail = (ujian: BeritaUjian) => {
    setSelected(ujian);
    setOpenDialog(true);
  };

  // Helper: Load Image
  const getBase64ImageFromURL = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = (error) => {
        // Fallback or reject
        console.error("Failed to load image", error);
        resolve(""); // Resolve empty string to avoid crashing
      };
      img.src = url;
    });
  };

  const handleDownloadSuratLulus = async (item: BeritaUjian) => {
    // 1. Prepare PDF
    const doc = new jsPDF();
    const logoUrl = "/images/uin-raden-fatah.png"; // Ensure this path is correct in public folder
    let logoData = "";
    try {
      logoData = await getBase64ImageFromURL(logoUrl);
    } catch (e) {
      console.error(e);
    }

    // Determine exam name based on type
    const rawType = item.jenisUjian?.namaJenis?.toLowerCase() || "";
    let examName = "Ujian";
    if (rawType.includes("proposal")) examName = "Ujian Seminar Proposal Skripsi";
    else if (rawType.includes("hasil")) examName = "Ujian Seminar Hasil Skripsi";
    else if (rawType.includes("skripsi")) examName = "Ujian Skripsi";
    else examName = item.jenisUjian?.namaJenis || "Ujian";

    // Settings
    const margin = 15;
    const startY = 15;
    const boxW = 180; // Total width
    const infoW = 95; // Middle column width
    const logoW = 30; // Left column width
    const metaW = boxW - logoW - infoW; // Right column width ~ 55

    // -- DRAW HEADER GRID --

    // Top Row Height (Logo & Institusi & Meta 1 & 2)
    const h1 = 25;
    // Bottom Row Height (Judul & Tgl Terbit)
    const h2 = 10;

    // 1. Box Logo (Kiri Atas - Bawah)
    // Logo merges row 1
    doc.rect(margin, startY, logoW, h1);
    if (logoData) {
      doc.addImage(logoData, "PNG", margin + 2, startY + 2, 26, 21); // Adjust scaling
    }

    // 2. Box Institusi (Tengah Atas)
    doc.rect(margin + logoW, startY, infoW, h1);
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    // Center text vertically/horizontally in box
    const textX = margin + logoW + (infoW / 2);
    let textY = startY + 6;
    doc.text("UIN RADEN FATAH PALEMBANG", textX, textY, { align: "center" });
    textY += 5;
    doc.text("FAKULTAS SAINS DAN TEKNOLOGI", textX, textY, { align: "center" });
    textY += 5;
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.text("Jl. Prof. K. H. Zainal Abidin Fikry", textX, textY, { align: "center" });
    textY += 4;
    doc.text("Palembang", textX, textY, { align: "center" });


    const rightX = margin + logoW + infoW;

    // Baris 1 Kanan: Revisi & Tanggal
    const hRight1 = 7;
    doc.rect(rightX, startY, metaW, hRight1);

    // Garis pemisah vertical untuk Revisi | Tanggal
    // Asumsi bagi 2 rata
    const halfMeta = metaW / 2;
    doc.line(rightX + halfMeta, startY, rightX + halfMeta, startY + hRight1);

    doc.setFontSize(8);
    doc.text("Revisi 01", rightX + (halfMeta / 2), startY + 5, { align: "center" });
    doc.text("1 Agustus 2018", rightX + halfMeta + (halfMeta / 2), startY + 5, { align: "center" });

    // Baris 2 Kanan: Kode
    const hRight2 = h1 - hRight1; // sisa height
    doc.rect(rightX, startY + hRight1, metaW, hRight2);

    doc.text("Kode", rightX + (metaW / 2), startY + hRight1 + 5, { align: "center" });
    doc.setFont("times", "bold");
    doc.text("FST. FORM SKRIPSI 11", rightX + (metaW / 2), startY + hRight1 + 10, { align: "center" });

    // 4. Box Bawah (Judul & Tgl Terbit)
    // Judul merge Logo + Institusi columns?
    // Lihat gambar: "Surat Keterangan Lulus..." ada di bawah Logo & Institusi.
    // "Tgl Terbit..." ada di bawah Meta Data Kanan.

    const wBottomLeft = logoW + infoW;
    doc.rect(margin, startY + h1, wBottomLeft, h2);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text("Surat Keterangan Lulus", margin + (wBottomLeft / 2), startY + h1 + 4, { align: "center" });
    doc.text(examName, margin + (wBottomLeft / 2), startY + h1 + 8, { align: "center" });

    // Box Bawah Kanan (Tgl Terbit)
    doc.rect(rightX, startY + h1, metaW, h2);
    doc.setFont("times", "normal");
    doc.setFontSize(8);
    doc.text("Tgl. Terbit", rightX + (metaW / 2), startY + h1 + 4, { align: "center" });
    doc.text("1 Pebruari 2018", rightX + (metaW / 2), startY + h1 + 8, { align: "center" });

    // -- BODY CONTENT --
    let y = startY + h1 + h2 + 10; // Start content below header + gap

    // Use Helvetica as a proxy for Calibri (Sans-serif)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11); // Slightly smaller to fit content if needed, or keep 12. Calibri 11/12 is common.

    const hari = item.hariUjian ? item.hariUjian.charAt(0).toUpperCase() + item.hariUjian.slice(1) : "....................";
    const tanggal = item.jadwalUjian ? new Date(item.jadwalUjian).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ".......................";
    const waktuMulai = item.waktuMulai ? item.waktuMulai.slice(0, 5) : ".....";
    const waktuSelesai = item.waktuSelesai ? item.waktuSelesai.slice(0, 5) : ".....";

    // 1. Opening
    doc.text(`Pada hari ini ${hari} tanggal ${tanggal}, telah berlangsung ${examName.toLowerCase()}`, 20, y);
    y += 6;
    doc.text("mahasiswa:", 20, y);
    y += 10;

    // 2. Student Info
    // Adjusted X positions to prevent overlap for long labels like "Dosen Pembimbing II"
    const labelX = 30;
    const colonX = 70; // Increased from 65
    const valueX = 75; // Increased from 70

    doc.text("Nama", labelX, y);
    doc.text(":", colonX, y);
    doc.text(item.mahasiswa?.nama || "-", valueX, y);
    y += 7;

    doc.text("NIM", labelX, y);
    doc.text(":", colonX, y);
    doc.text(item.mahasiswa?.nim || "-", valueX, y);
    y += 7;

    doc.text("Program Studi", labelX, y);
    doc.text(":", colonX, y);
    doc.text(item.mahasiswa?.prodi?.namaProdi || "-", valueX, y);
    y += 12;

    // 3. Time Info
    doc.text(`Ujian berlangsung dari pukul ${waktuMulai} WIB, sampai dengan ${waktuSelesai} WIB`, 20, y);
    y += 10;

    // 4. Pembimbing
    doc.text("Dosen Pembimbing I", labelX, y);
    doc.text(":", colonX, y);
    doc.text(item.mahasiswa?.pembimbing1?.nama || "........................................................................", valueX, y);
    y += 7;

    doc.text("Dosen Pembimbing II", labelX, y);
    doc.text(":", colonX, y);
    doc.text(item.mahasiswa?.pembimbing2?.nama || "........................................................................", valueX, y);
    y += 12;

    // 5. Penguji
    doc.text("Penguji:", 20, y);
    y += 8;

    const ketua = item.penguji?.find((p) => p.peran === "ketua_penguji")?.nama || "........................................................................";
    const sekretaris = item.penguji?.find((p) => p.peran === "sekretaris_penguji")?.nama || "........................................................................";
    const penguji1 = item.penguji?.find((p) => p.peran === "penguji_1")?.nama || "........................................................................";
    const penguji2 = item.penguji?.find((p) => p.peran === "penguji_2")?.nama || "........................................................................";

    doc.text("Ketua Penguji", labelX, y);
    doc.text(":", colonX, y);
    doc.text(ketua, valueX, y);
    y += 7;

    doc.text("Sekretaris Penguji", labelX, y);
    doc.text(":", colonX, y);
    doc.text(sekretaris, valueX, y);
    y += 7;

    doc.text("Penguji I", labelX, y);
    doc.text(":", colonX, y);
    doc.text(penguji1, valueX, y);
    y += 7;

    doc.text("Penguji II", labelX, y);
    doc.text(":", colonX, y);
    doc.text(penguji2, valueX, y);
    y += 12;

    // 6. Result
    doc.text(`Dari hasil ${examName} tersebut memutuskan bahwa yang bersangkutan dinyatakan:`, 20, y);
    y += 12;

    const nilai = item.nilaiAkhir ? Number(item.nilaiAkhir).toFixed(2) : "......";
    const huruf = item.nilaiAkhir ? getNilaiHuruf(Number(item.nilaiAkhir)) : "......";

    // Centered LULUS
    doc.setFont("helvetica", "bold");
    doc.text(`LULUS dengan nilai: ${nilai} (${huruf})`, 105, y, { align: "center" });
    doc.setFont("helvetica", "normal");
    y += 12;

    doc.text(`Demikian Surat Keterangan ini dibuat sebagai bukti dari hasil ${examName}.`, 20, y);
    y += 20;

    // -- Signature --
    // Right aligned signature for Kaprodi
    // Using startX for the block to ensure alignment
    const signBlockX = 120;

    const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

    // Alignt everything in the signature block to start at signBlockX
    doc.text(`Palembang, ${today}`, signBlockX, y);
    y += 6;
    doc.text("Mengetahui,", signBlockX, y);
    y += 6;
    doc.text("Ketua Program Studi,", signBlockX, y);
    y += 30; // space for signature

    // Dashed/Dotted line for Name
    doc.text("Gusmelia Testiana, M.Kom.", signBlockX, y);
    y += 6;
    // NIP
    doc.text("NIP. 1234567890", signBlockX, y);

    doc.save(`Surat_Keterangan_Lulus_${item.mahasiswa?.nim || "mahasiswa"}.pdf`);
  };

  const handleDownloadBeritaAcara = async (item: BeritaUjian) => {
    const doc = new jsPDF();
    const logoUrl = "/images/uin-raden-fatah.png";
    let logoData = "";
    try {
      logoData = await getBase64ImageFromURL(logoUrl);
    } catch (e) {
      console.error("Error loading logo:", e);
    }

    // --- CONFIG ---
    const mx = 15;
    let my = 15;
    const contentWidth = 180;
    const cw = [10, 80, 50, 40]; // No, Nama, Jabatan, TTD
    const rowHeight = 10;

    // --- HEADER TABLE ---
    doc.setLineWidth(0.3);
    doc.rect(mx, my, 100, 25);
    if (logoData) {
      doc.addImage(logoData, 'PNG', mx + 2, my + 2, 21, 21);
    }
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.text("UIN RADEN FATAH PALEMBANG", mx + 25, my + 8);
    doc.text("FAKULTAS SAINS DAN TEKNOLOGI", mx + 25, my + 13);
    doc.text("Jl. Prof. K.H. Zainal Abidin Fikry", mx + 25, my + 18);
    doc.text("Palembang", mx + 25, my + 23);

    const col2X = mx + 100;
    doc.rect(col2X, my, 80, 7);
    doc.line(col2X + 25, my, col2X + 25, my + 7);
    doc.setFontSize(9);
    doc.text("Revisi 01", col2X + 12.5, my + 5, { align: "center" });
    doc.text("1 Agustus 2018", col2X + 52.5, my + 5, { align: "center" });

    doc.rect(col2X, my + 7, 80, 10);
    doc.text("Kode", col2X + 40, my + 11, { align: "center" });
    doc.setFont("times", "bold");
    doc.text("FST. FORM SKRIPSI 03", col2X + 40, my + 15, { align: "center" });

    doc.rect(col2X, my + 17, 80, 8);
    doc.setFont("times", "normal");
    doc.text("Tgl. Terbit", col2X + 40, my + 21, { align: "center" });
    doc.text("1 Februari 2018", col2X + 40, my + 24, { align: "center" });

    my += 25;
    doc.rect(mx, my, contentWidth, 8);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    const formTitle = item.jenisUjian?.namaJenis?.toLowerCase().includes("proposal")
      ? "Formulir Berita Acara Ujian Seminar Proposal"
      : "Formulir Berita Acara Ujian Skripsi";
    doc.text(formTitle, mx + 2, my + 5.5);

    my += 15;

    // --- CONTENT ---
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    const docTitle = item.jenisUjian?.namaJenis?.toLowerCase().includes("proposal")
      ? "BERITA ACARA UJIAN SEMINAR PROPOSAL"
      : "BERITA ACARA UJIAN SKRIPSI";
    doc.text(docTitle, 105, my, { align: "center" });

    my += 10;
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    const hari = item.hariUjian ? item.hariUjian.charAt(0).toUpperCase() + item.hariUjian.slice(1) : "...";
    const tanggal = item.jadwalUjian ? new Date(item.jadwalUjian).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "...";
    doc.text(`Pada hari ini ${hari}, tanggal ${tanggal} telah dilaksanakan ${item.jenisUjian?.namaJenis?.toLowerCase() || "skripsi"}:`, mx, my);

    my += 8;
    const startXLabel = mx + 10;
    const startXColon = startXLabel + 35;
    const startXValue = startXColon + 5;

    const labels = [
      { l: "Nama", v: item.mahasiswa?.nama || "" },
      { l: "NIM", v: item.mahasiswa?.nim || "" },
      { l: "Program Studi", v: item.mahasiswa?.prodi?.namaProdi?.toUpperCase() || "" },
      { l: "Judul", v: item.judulPenelitian || "" },
    ];
    labels.forEach(row => {
      doc.text(row.l, startXLabel, my);
      doc.text(":", startXColon, my);
      if (row.l === "Judul") {
        const splitTitle = doc.splitTextToSize(row.v, 120);
        doc.text(splitTitle, startXValue, my);
        my += (splitTitle.length * 6);
      } else {
        doc.text(row.v, startXValue, my);
        my += 8;
      }
    });

    if (item.jenisUjian?.namaJenis?.toLowerCase().includes("proposal")) {
      doc.text("Proposal", startXLabel, my);
      my += 8;
    }

    // --- TABLE ---
    my += 5;
    doc.text("Tim Penguji:", mx, my);
    my += 4;

    const tableX = mx;
    const headerHeight = 7;
    doc.rect(tableX, my, cw[0], headerHeight);
    doc.rect(tableX + cw[0], my, cw[1], headerHeight);
    doc.rect(tableX + cw[0] + cw[1], my, cw[2], headerHeight);
    doc.rect(tableX + cw[0] + cw[1] + cw[2], my, cw[3], headerHeight);

    doc.text("No", tableX + cw[0] / 2, my + 5, { align: "center" });
    doc.text("Nama", tableX + cw[0] + cw[1] / 2, my + 5, { align: "center" });
    doc.text("Jabatan", tableX + cw[0] + cw[1] + cw[2] / 2, my + 5, { align: "center" });
    doc.text("Tanda Tangan", tableX + cw[0] + cw[1] + cw[2] + cw[3] / 2, my + 5, { align: "center" });
    my += headerHeight;

    const pengujiListBA = [ // Renamed to avoid redeclaration
      { role: "Ketua Penguji", name: item.penguji?.find(p => p.peran === "ketua_penguji")?.nama || "" },
      { role: "Sekretaris Penguji", name: item.penguji?.find(p => p.peran === "sekretaris_penguji")?.nama || "" },
      { role: "Penguji I", name: item.penguji?.find(p => p.peran === "penguji_1")?.nama || "" },
      { role: "Penguji II", name: item.penguji?.find(p => p.peran === "penguji_2")?.nama || "" },
    ];

    pengujiListBA.forEach((p, idx) => {
      const noStr = (idx + 1).toString() + ".";
      const nameLines = doc.splitTextToSize(p.name, cw[1] - 4);
      const roleLines = doc.splitTextToSize(p.role, cw[2] - 4);
      const maxLines = Math.max(nameLines.length, roleLines.length);
      const currentHeight = Math.max(rowHeight, 4 + (maxLines * 5));

      doc.rect(tableX, my, cw[0], currentHeight);
      doc.rect(tableX + cw[0], my, cw[1], currentHeight);
      doc.rect(tableX + cw[0] + cw[1], my, cw[2], currentHeight);
      doc.rect(tableX + cw[0] + cw[1] + cw[2], my, cw[3], currentHeight);

      doc.text(noStr, tableX + cw[0] / 2, my + (currentHeight / 2) + 1.5, { align: "center" });
      doc.text(nameLines, tableX + 2 + cw[0], my + (currentHeight - (nameLines.length * 5)) / 2 + 4);
      doc.text(roleLines, tableX + cw[0] + cw[1] + cw[2] / 2, my + (currentHeight - (roleLines.length * 5)) / 2 + 4, { align: "center" });
      doc.text(`(${idx + 1})`, tableX + cw[0] + cw[1] + cw[2] + cw[3] / 2, my + (currentHeight / 2) + 1.5, { align: "center" }); // TTD

      my += currentHeight;
    });

    // --- DECISION ---
    my += 10;
    doc.setFont("times", "bold");
    const docType = item.jenisUjian?.namaJenis?.toLowerCase().includes("proposal") ? "Proposal" : "Skripsi";
    let statusText = "DITERIMA / DITOLAK";
    if (item.hasil) {
      statusText = item.hasil.toLowerCase() === "lulus" ? "DITERIMA" : "DITOLAK";
    }
    doc.text(`MEMUTUSKAN: ${docType} saudara dinyatakan ${statusText} dengan catatan terlampir.`, mx, my);

    // --- FOOTER ---
    my += 20;
    doc.setFont("times", "normal");
    const rightColX = 140;
    doc.text("Ditetapkan di: Palembang", rightColX, my);
    my += 5;
    const footerDate = item.jadwalUjian ? new Date(item.jadwalUjian).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "................................";
    doc.text(`Pada tanggal: ${footerDate}`, rightColX, my);

    my += 15;
    const leftSigX = mx;
    const rightSigX = rightColX;
    doc.text("Ketua Penguji,", leftSigX, my);
    doc.text("Sekretaris Penguji,", rightSigX, my);
    my += 25;
    const ketuaName = item.penguji?.find(p => p.peran === "ketua_penguji")?.nama || "(...................................)";
    const sekName = item.penguji?.find(p => p.peran === "sekretaris_penguji")?.nama || "(...................................)";
    doc.text(ketuaName, leftSigX, my);
    doc.text(sekName, rightSigX, my);
    doc.save(`BA_${item.mahasiswa?.nim || "Ujian"}.pdf`);
  };

  const handleDownloadDaftarHadir = async (item: BeritaUjian) => {
    const doc = new jsPDF();
    const logoUrl = "/images/uin-raden-fatah.png";
    let logoData = "";
    let dosenList: any[] = [];
    let userList: any[] = [];

    try {
      // Fetch resources in parallel
      const [logo, dosen, users] = await Promise.all([
        getBase64ImageFromURL(logoUrl),
        getAllDosen(),
        getAllUsers()
      ]);
      logoData = logo;
      dosenList = dosen || [];
      userList = users || [];
    } catch (e) { console.error(e); }

    const mx = 15, contentWidth = 180;
    let my = 15;

    // Header form
    doc.setLineWidth(0.3);
    doc.rect(mx, my, 100, 25);
    if (logoData) doc.addImage(logoData, 'PNG', mx + 2, my + 2, 21, 21);
    doc.setFont("times", "normal"); doc.setFontSize(9);
    doc.text("UIN RADEN FATAH PALEMBANG", mx + 25, my + 8);
    doc.text("FAKULTAS SAINS DAN TEKNOLOGI", mx + 25, my + 13);
    doc.text("Jl. Prof. K.H. Zainal Abidin Fikry", mx + 25, my + 18);
    doc.text("Palembang", mx + 25, my + 23);

    const col2X = mx + 100;
    doc.rect(col2X, my, 80, 7);
    doc.line(col2X + 25, my, col2X + 25, my + 7);
    doc.setFontSize(9);
    doc.text("Revisi 01", col2X + 12.5, my + 5, { align: "center" });
    doc.text("1 Agustus 2018", col2X + 52.5, my + 5, { align: "center" });
    doc.rect(col2X, my + 7, 80, 10);
    doc.text("Kode", col2X + 40, my + 11, { align: "center" });
    doc.setFont("times", "bold");
    doc.text("FST. FORM SKRIPSI 04", col2X + 40, my + 15, { align: "center" });
    doc.rect(col2X, my + 17, 80, 8);
    doc.setFont("times", "normal");
    doc.text("Tgl. Terbit", col2X + 40, my + 21, { align: "center" });
    doc.text("1 Februari 2018", col2X + 40, my + 24, { align: "center" });

    my += 25; doc.rect(mx, my, contentWidth, 8);
    doc.setFont("times", "bold"); doc.setFontSize(11);
    const formTitleDH = item.jenisUjian?.namaJenis?.toLowerCase().includes("proposal") ? "Formulir Daftar Hadir Ujian Seminar Proposal" : "Formulir Daftar Hadir Ujian Skripsi";
    doc.text(formTitleDH, mx + 2, my + 5.5);
    my += 15;

    // Content
    doc.setFont("times", "normal"); doc.setFontSize(11);
    const startXLabelDH = mx + 2, startXColonDH = startXLabelDH + 35, startXValueDH = startXColonDH + 5;
    const hariDH = item.hariUjian ? item.hariUjian.charAt(0).toUpperCase() + item.hariUjian.slice(1) : "...";
    const tanggalDH = item.jadwalUjian ? new Date(item.jadwalUjian).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "...";
    const waktuStr = item.waktuMulai && item.waktuSelesai ? `${item.waktuMulai} - ${item.waktuSelesai} WIB` : ".......................... WIB";

    doc.text("Hari/Tanggal", startXLabelDH, my); doc.text(":", startXColonDH, my); doc.text(`${hariDH} / ${tanggalDH}`, startXValueDH, my); my += 8;
    doc.text("Waktu", startXLabelDH, my); doc.text(":", startXColonDH, my); doc.text(waktuStr, startXValueDH, my); my += 8;
    doc.text("Nama Mahasiswa", startXLabelDH, my); doc.text(":", startXColonDH, my); doc.text(item.mahasiswa?.nama || "-", startXValueDH, my); my += 8;
    doc.text("NIM", startXLabelDH, my); doc.text(":", startXColonDH, my); doc.text(item.mahasiswa?.nim || "-", startXValueDH, my); my += 8;
    doc.text("Judul Proposal", startXLabelDH, my); doc.text(":", startXColonDH, my);
    const splitTitleDH = doc.splitTextToSize(item.judulPenelitian || "-", 120);
    doc.text(splitTitleDH, startXValueDH, my); my += (splitTitleDH.length * 6) + 5;

    // Table Daftar Hadir
    const tableXDH = mx;
    const cwDH = [10, 50, 40, 40, 40]; // No, Nama, NIP, Jabatan, TTD
    const headerHeightDH = 10;

    doc.rect(tableXDH, my, cwDH[0], headerHeightDH); doc.rect(tableXDH + cwDH[0], my, cwDH[1], headerHeightDH); doc.rect(tableXDH + cwDH[0] + cwDH[1], my, cwDH[2], headerHeightDH);
    doc.rect(tableXDH + cwDH[0] + cwDH[1] + cwDH[2], my, cwDH[3], headerHeightDH); doc.rect(tableXDH + cwDH[0] + cwDH[1] + cwDH[2] + cwDH[3], my, cwDH[4], headerHeightDH);

    doc.text("No", tableXDH + cwDH[0] / 2, my + 6, { align: "center" }); doc.text("Nama", tableXDH + cwDH[0] + cwDH[1] / 2, my + 6, { align: "center" });
    doc.text("NIP/NIDN", tableXDH + cwDH[0] + cwDH[1] + cwDH[2] / 2, my + 6, { align: "center" }); doc.text("Jabatan", tableXDH + cwDH[0] + cwDH[1] + cwDH[2] + cwDH[3] / 2, my + 6, { align: "center" });
    doc.text("Tanda", tableXDH + cwDH[0] + cwDH[1] + cwDH[2] + cwDH[3] + cwDH[4] / 2, my + 4, { align: "center" }); doc.text("Tangan", tableXDH + cwDH[0] + cwDH[1] + cwDH[2] + cwDH[3] + cwDH[4] / 2, my + 8, { align: "center" });
    my += headerHeightDH;

    const pengujiListDH = [
      { role: "Ketua Penguji", name: item.penguji?.find(p => p.peran === "ketua_penguji")?.nama || "" },
      { role: "Sekretaris Penguji", name: item.penguji?.find(p => p.peran === "sekretaris_penguji")?.nama || "" },
      { role: "Penguji I", name: item.penguji?.find(p => p.peran === "penguji_1")?.nama || "" },
      { role: "Penguji II", name: item.penguji?.find(p => p.peran === "penguji_2")?.nama || "" },
    ];

    pengujiListDH.forEach((p, idx) => {
      const displayNo = (idx + 1).toString() + ".";
      const nameLines = doc.splitTextToSize(p.name, cwDH[1] - 4);

      // Cari NIP/NIDN
      const matchDosen = dosenList.find(d => d.nama?.toLowerCase() === p.name?.toLowerCase());
      const nipStr = matchDosen?.nidn || matchDosen?.nip || "..........................";

      const nipLines = doc.splitTextToSize(nipStr, cwDH[2] - 4);
      const lineCount = Math.max(nameLines.length, nipLines.length, 1);
      const currentHeight = Math.max(12, 4 + (lineCount * 5));

      doc.rect(tableXDH, my, cwDH[0], currentHeight);
      doc.rect(tableXDH + cwDH[0], my, cwDH[1], currentHeight);
      doc.rect(tableXDH + cwDH[0] + cwDH[1], my, cwDH[2], currentHeight);
      doc.rect(tableXDH + cwDH[0] + cwDH[1] + cwDH[2], my, cwDH[3], currentHeight);
      doc.rect(tableXDH + cwDH[0] + cwDH[1] + cwDH[2] + cwDH[3], my, cwDH[4], currentHeight);

      const midY = my + (currentHeight / 2) + 1.5;
      doc.text(displayNo, tableXDH + cwDH[0] / 2, midY, { align: "center" });
      doc.text(nameLines, tableXDH + 2 + cwDH[0], my + (currentHeight - (nameLines.length * 5)) / 2 + 4);
      doc.text(nipLines, tableXDH + 2 + cwDH[0] + cwDH[1], my + (currentHeight - (nipLines.length * 5)) / 2 + 4);
      doc.text(p.role, tableXDH + cwDH[0] + cwDH[1] + cwDH[2] + cwDH[3] / 2, midY, { align: "center" });
      // User request: "tanda tangan kosongkan". So no text.

      my += currentHeight;
    });

    // --- FOOTER ---
    my += 15;
    const rightColXDH = 130;
    doc.text("Palembang,", rightColXDH, my);
    my += 5;
    doc.text("Ketua Program Studi,", rightColXDH, my);
    my += 25;

    // Find Kaprodi by specific NIP as requested
    // NIP: 19750801 200912 2 001
    const targetNipClean = "197508012009122001";
    let kaprodiObj = dosenList.find(d =>
      d.nip && d.nip.replace(/\s/g, "") === targetNipClean
    );

    // Fallback if not found by NIP, try logic by Prodi/Jabatan as specific NIP might be wrong or data incomplete
    if (!kaprodiObj && item.mahasiswa?.prodi?.namaProdi) {
      const mhsProdi = item.mahasiswa.prodi.namaProdi;
      kaprodiObj = dosenList.find(d =>
        d.prodi?.nama === mhsProdi &&
        (d.jabatan?.toLowerCase().includes("kaprodi") || d.jabatan?.toLowerCase().includes("ketua program studi"))
      );
    }

    const kaprodiNameDH = kaprodiObj?.nama || "(.......................................)";
    const kaprodiNipVal = kaprodiObj?.nip ? `NIP. ${kaprodiObj.nip}` : "NIP.";

    doc.text(kaprodiNameDH, rightColXDH, my);
    my += 5;
    doc.text(kaprodiNipVal, rightColXDH, my);

    doc.save(`Daftar_Hadir_${item.mahasiswa?.nim || "Ujian"}.pdf`);
  };



  // Kolom untuk TableGlobal
  const cols = [
    {
      id: "no",
      header: "No",
      cell: ({ row, table }: any) => {
        const index =
          (table.getState().pagination?.pageIndex ?? 0) *
          (table.getState().pagination?.pageSize ?? 10) +
          row.index +
          1;
        return <div>{index}</div>;
      },
      size: 36,
    },
    {
      accessorFn: (row: BeritaUjian) => row.mahasiswa?.nama ?? "-",
      id: "mahasiswa",
      header: "Mahasiswa",
      cell: ({ row }: any) => (
        <div>
          {row.getValue("mahasiswa")}
          <br />
          <span className="text-xs text-gray-500">
            {row.original.mahasiswa?.nim ?? "-"}
          </span>
        </div>
      ),
      size: 120,
    },
    {
      accessorFn: (row: BeritaUjian) => row.judulPenelitian ?? "-",
      id: "judul",
      header: "Judul",
      cell: ({ row }: any) => (
        <div className=" max-w-[200px] text-sm truncate">
          {row.getValue("judul")}
        </div>
      ),
      size: 180,
    },
    {
      accessorFn: (row: BeritaUjian) => row.jenisUjian?.namaJenis ?? "-",
      id: "jenis",
      header: "Jenis",
      cell: ({ row }: any) => {
        const jenis = row.getValue("jenis")?.toLowerCase() ?? "";
        const badgeClass = jenis.includes("proposal")
          ? "bg-blue-100 text-blue-700"
          : jenis.includes("hasil")
            ? "bg-yellow-100 text-yellow-700"
            : jenis.includes("skripsi")
              ? "bg-green-100 text-green-700"
              : "bg-gray-100";
        return (
          <span className={`px-2 py-1 rounded font-medium ${badgeClass}`}>
            {row.getValue("jenis")}
          </span>
        );
      },
      size: 90,
    },
    {
      accessorFn: (row: BeritaUjian) => row.nilaiAkhir ?? 0,
      id: "nilaiAkhir",
      header: () => <div className="text-center">Nilai Akhir</div>,
      cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-1.5 font-medium">
          <span>{Number(row.getValue("nilaiAkhir") || 0).toFixed(2)}</span>

          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div className="cursor-help text-gray-400 hover:text-blue-500 transition-colors">
                  <AlertCircle size={14} />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-xl p-3 rounded-xl">
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-gray-900 dark:text-gray-100 mb-1">Skala Nilai</span>
                  <div className="grid grid-cols-[20px_1fr] gap-x-2 gap-y-1">
                    <span className="font-semibold text-green-600">A</span> <span className="text-gray-500">: 80 – 100</span>
                    <span className="font-semibold text-blue-600">B</span> <span className="text-gray-500">: 70 – 79.99</span>
                    <span className="font-semibold text-yellow-600">C</span> <span className="text-gray-500">: 60 – 69.99</span>
                    <span className="font-semibold text-orange-600">D</span> <span className="text-gray-500">: 56 – 59.99</span>
                    <span className="font-semibold text-red-600">E</span> <span className="text-gray-500">: &lt; 56</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      size: 100,
    },

    {
      accessorFn: (row: BeritaUjian) => row.hasil ?? "-",
      id: "hasil",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }: any) => {
        const hasil = row.getValue("hasil")?.toLowerCase();
        const badgeClass =
          hasil === "lulus"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : hasil === "tidak lulus"
              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
              : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200";
        return hasil && hasil !== "" ? (
          <div className="flex items-center justify-center">

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClass}`}
            >
              {row.getValue("hasil")}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
      size: 100,
    },
    {
      accessorFn: (row: BeritaUjian) => row.catatan ?? "-",
      id: "catatan",
      header: () => <div className="text-center">Catatan</div>,
      cell: ({ row }: any) => {
        const catatan = row.getValue("catatan");
        if (!catatan || catatan === "-")
          return (
            <div className="flex justify-center">
              <span className="text-gray-400">-</span>
            </div>
          );

        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCatatan(catatan);
                setOpenCatatanDialog(true);
              }}
              className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Eye size={16} />
            </Button>
          </div>
        );
      },
      size: 80,
    },
    {
      id: "aksi",
      header: () => <div className="text-center">Aksi</div>,
      cell: ({ row }: any) => {
        const item = row.original;
        // const isLulus = item.hasil?.toLowerCase() === "lulus";
        // const isProposal = item.jenisUjian?.namaJenis?.toLowerCase().includes("proposal");

        return (
          <div className="flex justify-center items-center gap-1">
            {/* Tombol Detail */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetail(item);
                    }}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Eye size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lihat Detail</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Tombol Surat (Moved to Modal) */}
          </div>
        );
      },
      size: 100,
    },
  ];

  // TableGlobal setup
  const table = {
    getRowModel: () => ({
      rows: paginatedData.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
        getVisibleCells: () =>
          cols.map((col) => ({
            id: col.id,
            column: { columnDef: col },
            getContext: () => ({
              row: {
                index: idx,
                original: item,
                getValue: (key: string) => {
                  if (col.accessorFn) return col.accessorFn(item);
                  // Hindari akses dinamis ke properti tanpa index signature
                  return (item as any)[key];
                },
              },
              table,
            }),
          })),
        getIsSelected: () => false,
      })),
    }),
    getHeaderGroups: () => [
      {
        id: "main",
        headers: cols.map((col) => ({
          id: col.id,
          isPlaceholder: false,
          column: { columnDef: col },
          getContext: () => ({ table }),
        })),
      },
    ],
    previousPage: () => setPage((p) => Math.max(1, p - 1)),
    nextPage: () => setPage((p) => Math.min(totalPage, p + 1)),
    getCanPreviousPage: () => page > 1,
    getCanNextPage: () => page < totalPage,
    getFilteredRowModel: () => ({
      rows: filteredData.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
        getVisibleCells: () =>
          cols.map((col) => ({
            id: col.id,
            column: { columnDef: col },
            getContext: () => ({
              row: {
                index: idx,
                original: item,
                getValue: (key: string) => {
                  if (col.accessorFn) return col.accessorFn(item);
                  // Hindari akses dinamis ke properti tanpa index signature
                  return (item as any)[key];
                },
              },
              table,
            }),
          })),
        getIsSelected: () => false,
      })),
    }),
    getPreFilteredRowModel: () => ({
      rows: ujian.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
        getVisibleCells: () =>
          cols.map((col) => ({
            id: col.id,
            column: { columnDef: col },
            getContext: () => ({
              row: {
                index: idx,
                original: item,
                getValue: (key: string) => {
                  if (col.accessorFn) return col.accessorFn(item);
                  // Hindari akses dinamis ke properti tanpa index signature
                  return (item as any)[key];
                },
              },
              table,
            }),
          })),
        getIsSelected: () => false,
      })),
    }),
    getState: () => ({
      pagination: { pageIndex: page - 1, pageSize },
    }),
    getPageCount: () => totalPage,
    setPageIndex: (p: number) => setPage(p + 1),
  };

  // Modern minimalist penguji rekap
  function renderRekapPenilaian() {
    if (!penilaian || penilaian.length === 0) {
      return (
        <div className="text-sm text-gray-400 italic">
          Tidak ada data penilaian.
        </div>
      );
    }
    const pengujiMap: Record<
      number,
      { nama: string; nidn: string; total: number }
    > = {};
    penilaian.forEach((p) => {
      if (!pengujiMap[p.dosenId]) {
        pengujiMap[p.dosenId] = {
          nama: p.dosen?.nama || "-",
          nidn: p.dosen?.nidn || "-",
          total: 0,
        };
      }
      const bobot = p.komponenPenilaian?.bobot ?? 0;
      pengujiMap[p.dosenId].total += ((p.nilai ?? 0) * bobot) / 100;
    });

    return (
      <div className="flex flex-col gap-4">
        {Object.values(pengujiMap).map((penguji, idx) => (
          <div
            key={penguji.nidn + idx}
            className="rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-neutral-800 dark:to-neutral-900 border border-gray-100 dark:border-neutral-800 px-6 py-4 flex flex-col gap-1 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-base text-gray-900 dark:text-white">
                {penguji.nama}
              </span>
              <span className="ml-2 text-xs text-gray-400 font-normal">
                NIDN: {penguji.nidn}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">Total Nilai:</span>
              <span className="font-extrabold text-lg text-blue-600 dark:text-blue-400 tracking-wide">
                {penguji.total.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Helper untuk konversi nilai ke huruf
  function getNilaiHuruf(n: number): string {
    if (n >= 80) return "A";
    if (n >= 70) return "B";
    if (n >= 60) return "C";
    if (n >= 56) return "D";
    return "E";
  }


  const handleDownloadRekapNilai = async () => {
    // 1. Gather Data & Resources
    const doc = new jsPDF();
    const logoUrl = "/images/uin-raden-fatah.png";
    let logoData = "";
    let dosenList: any[] = [];

    try {
      const [logo, dosen] = await Promise.all([
        getBase64ImageFromURL(logoUrl),
        getAllDosen(),
      ]);
      logoData = logo;
      dosenList = dosen || [];
    } catch (e) { console.error(e); }

    // Identify Exams
    const proposal = ujian.find(u => u.jenisUjian?.namaJenis?.toLowerCase().includes("proposal"));
    const hasil = ujian.find(u => u.jenisUjian?.namaJenis?.toLowerCase().includes("hasil"));
    const skripsi = ujian.find(u => u.jenisUjian?.namaJenis?.toLowerCase().includes("skripsi"));

    const mainRecord = skripsi || hasil || proposal || ujian[0];
    if (!mainRecord) {
      console.error("Data ujian tidak ditemukan.");
      return;
    }

    // --- CONFIG ---
    const mx = 20; // Margin X
    let my = 15;   // Margin Y

    // --- HEADER ---
    doc.setLineWidth(0.3);
    // Box Kiri (Logo + Institusi)
    doc.rect(mx, my, 110, 25);
    if (logoData) {
      doc.addImage(logoData, 'PNG', mx + 2, my + 2, 21, 21);
    }
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    // Center Text Logic
    const centerText = (text: string, x: number, y: number) => {
      doc.text(text, x, y, { align: "center" });
    };

    // Institusi Text
    const instX = mx + 68; // Center of 25 + (110-25)/2 approx
    centerText("UIN RADEN FATAH PALEMBANG", instX, my + 6);
    centerText("FAKULTAS SAINS DAN TEKNOLOGI", instX, my + 11);
    doc.setFontSize(9);
    centerText("Jl. Prof. K.H. Zainal Abidin Fikry", instX, my + 16);
    centerText("Palembang", instX, my + 21);

    // Box Kanan Atas (Revisi & Tanggal)
    const col2X = mx + 110;
    const rightWidth = 60;
    doc.rect(col2X, my, rightWidth, 8);
    // Garis Separator Tengah
    doc.line(col2X + 30, my, col2X + 30, my + 8);

    doc.setFontSize(8);
    centerText("Revisi 01", col2X + 15, my + 5);
    centerText("1 Agustus 2018", col2X + 45, my + 5);

    // Box Kanan Tengah (Kode)
    doc.rect(col2X, my + 8, rightWidth, 8);
    centerText("Kode", col2X + 30, my + 11.5);
    doc.setFont("times", "bold");
    centerText("FST. FORM SKRIPSI 25", col2X + 30, my + 15);

    // Box Kanan Bawah (Tgl Terbit)
    doc.rect(col2X, my + 16, rightWidth, 9);
    doc.setFont("times", "normal");
    centerText("Tgl. Terbit", col2X + 30, my + 20);
    centerText("1 Pebruari 2018", col2X + 30, my + 23.5);

    my += 25;
    // Box Judul Form
    doc.rect(mx, my, 110 + rightWidth, 8); // Full width = 170
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    centerText("Formulir Rekapitulasi Nilai Skripsi", mx + (110 + rightWidth) / 2, my + 5.5);

    // --- STUDENT INFO ---
    my += 15;
    doc.setFont("times", "normal");
    doc.setFontSize(11);

    const startXLabel = mx + 5;
    const startXColon = startXLabel + 30;
    const startXValue = startXColon + 5;

    const hariSkripsi = skripsi?.hariUjian ? skripsi.hariUjian.charAt(0).toUpperCase() + skripsi.hariUjian.slice(1) : "....................";
    const tglSkripsi = skripsi?.jadwalUjian ? new Date(skripsi.jadwalUjian).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ".......................";
    const tglFormatted = tglSkripsi === "......................." ? "" : `${tglSkripsi}`; // Used in table or separate? Template shows "Hari/Tanggal : /"

    doc.text("Hari/Tanggal", startXLabel, my);
    doc.text(":", startXColon, my);
    doc.text(`${hariSkripsi} / ${tglFormatted}`, startXValue, my);
    my += 8;

    doc.text("Nama/NIM", startXLabel, my);
    doc.text(":", startXColon, my);
    doc.text(`${mainRecord.mahasiswa?.nama || ""} / ${mainRecord.mahasiswa?.nim || ""}`, startXValue, my);
    my += 8;

    doc.text("Judul Skripsi", startXLabel, my);
    doc.text(":", startXColon, my);
    const splitTitle = doc.splitTextToSize(mainRecord.judulPenelitian || "-", 120);
    doc.text(splitTitle, startXValue, my);
    my += (splitTitle.length * 6) + 10;

    // --- REKAP TABLE ---
    // Header
    const tableX = mx;
    const cw = [10, 60, 30, 30, 40]; // No, Komponen, Bobot %, Skor, Bobot*Skor (Total 170)
    const headerH = 8;

    doc.setFont("times", "bold"); // Bold for table header? Image is ambiguous, usually regular or bold. Let's start with Header.
    // Main Header "Rekap Nilai Skripsi" merge cells?
    // Template shows:
    // | Rekap Nilai Skripsi | (Merged)
    // | No | Komponen | Bobot % | Skor | Bobot * Skor |

    doc.rect(tableX, my, 170, 7);
    centerText("Rekap Nilai Skripsi", tableX + 85, my + 5);
    my += 7;

    doc.rect(tableX, my, cw[0], headerH);
    doc.rect(tableX + cw[0], my, cw[1], headerH);
    doc.rect(tableX + cw[0] + cw[1], my, cw[2], headerH);
    doc.rect(tableX + cw[0] + cw[1] + cw[2], my, cw[3], headerH);
    doc.rect(tableX + cw[0] + cw[1] + cw[2] + cw[3], my, cw[4], headerH);

    doc.setFontSize(10);
    centerText("No", tableX + cw[0] / 2, my + 5);
    centerText("Komponen", tableX + cw[0] + cw[1] / 2, my + 5);
    centerText("Bobot %", tableX + cw[0] + cw[1] + cw[2] / 2, my + 5);
    centerText("Skor", tableX + cw[0] + cw[1] + cw[2] + cw[3] / 2, my + 5);
    centerText("Bobot * Skor", tableX + cw[0] + cw[1] + cw[2] + cw[3] + cw[4] / 2, my + 5);
    my += headerH;

    // Rows
    const rows = [
      { name: "Seminar Proposal", bobot: 20, score: proposal?.nilaiAkhir },
      { name: "Ujian Hasil", bobot: 50, score: hasil?.nilaiAkhir },
      { name: "Ujian Skripsi", bobot: 30, score: skripsi?.nilaiAkhir },
    ];

    let totalNilaiAkhir = 0;
    doc.setFont("times", "normal");

    rows.forEach((r, i) => {
      const scoreNum = r.score ? parseFloat(r.score.toString()) : 0;
      const weightedScore = (scoreNum * r.bobot) / 100;
      totalNilaiAkhir += weightedScore;

      const rowH = 8;

      doc.rect(tableX, my, cw[0], rowH);
      doc.rect(tableX + cw[0], my, cw[1], rowH);
      doc.rect(tableX + cw[0] + cw[1], my, cw[2], rowH);
      doc.rect(tableX + cw[0] + cw[1] + cw[2], my, cw[3], rowH);
      doc.rect(tableX + cw[0] + cw[1] + cw[2] + cw[3], my, cw[4], rowH);

      centerText(`${i + 1}`, tableX + cw[0] / 2, my + 5.5);
      doc.text("  " + r.name, tableX + cw[0], my + 5.5); // align left with padding
      centerText(`${r.bobot}`, tableX + cw[0] + cw[1] + cw[2] / 2, my + 5.5);
      centerText(r.score ? Number(r.score).toFixed(2) : "-", tableX + cw[0] + cw[1] + cw[2] + cw[3] / 2, my + 5.5);
      centerText(r.score ? weightedScore.toFixed(2) : "-", tableX + cw[0] + cw[1] + cw[2] + cw[3] + cw[4] / 2, my + 5.5);

      my += rowH;
    });

    // Footer Total
    const colSpanTitle = cw[0] + cw[1] + cw[2] + cw[3]; // 合并前4列
    doc.rect(tableX, my, colSpanTitle, 8);
    // Align Right for "Total Angka Nilai"
    doc.text("Total Angka Nilai", tableX + colSpanTitle - 5, my + 5.5, { align: "right" });

    // Value Box
    doc.rect(tableX + colSpanTitle, my, cw[4], 8);
    centerText(totalNilaiAkhir.toFixed(2), tableX + colSpanTitle + cw[4] / 2, my + 5.5);
    my += 8;

    // Footer Huruf
    doc.rect(tableX, my, colSpanTitle, 8);
    doc.text("Nilai Huruf", tableX + colSpanTitle - 5, my + 5.5, { align: "right" });

    doc.rect(tableX + colSpanTitle, my, cw[4], 8);
    const huruf = getNilaiHuruf(totalNilaiAkhir);
    centerText(huruf, tableX + colSpanTitle + cw[4] / 2, my + 5.5);
    my += 20;

    // --- SIGNATURE & NOTES ---
    // Notes Left, Signature Right
    const noteY = my;
    const signY = my;

    // Notes
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text("Catatan interval nilai:", mx, noteY);
    const notes = [
      "A       : 80.00 – 100",
      "B       : 70.00 – 79.99",
      "C       : 60.00 – 69.99",
      "D       : 56.00 -59.99",
      "E       : < 55.99"
    ];
    let ny = noteY + 5;
    notes.forEach(note => {
      doc.text(note, mx, ny);
      ny += 5;
    });

    // Signature
    // Find Kaprodi
    const targetNipClean = "197508012009122001";
    let kaprodiObj = dosenList.find(d =>
      d.nip && d.nip.replace(/\s/g, "") === targetNipClean
    );
    // Fallback
    if (!kaprodiObj && mainRecord.mahasiswa?.prodi?.namaProdi) {
      const mhsProdi = mainRecord.mahasiswa.prodi.namaProdi;
      kaprodiObj = dosenList.find(d =>
        d.prodi?.nama === mhsProdi &&
        (d.jabatan?.toLowerCase().includes("kaprodi") || d.jabatan?.toLowerCase().includes("ketua program studi"))
      );
    }
    const kaprodiName = kaprodiObj?.nama || "(.......................................)";
    const kaprodiNip = kaprodiObj?.nip ? `NIP. ${kaprodiObj.nip}` : "NIP.";

    const rightColX = 130;
    const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    doc.text(`Palembang, ${today}`, rightColX, signY);
    doc.text("Ketua Program Studi,", rightColX, signY + 5);

    doc.text(kaprodiName, rightColX, signY + 30);
    doc.text(kaprodiNip, rightColX, signY + 35);

    doc.save(`Rekap_Nilai_Skripsi_${mainRecord.mahasiswa?.nim || "mahasiswa"}.pdf`);
  };

  return (
    <DataCard>
      {/* Detail Modal */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-50 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-white dark:bg-neutral-900">
            <div>
              <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Rekapitulasi Hasil Ujian
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Rincian penilaian dan status kelulusan mahasiswa.
              </DialogDescription>
            </div>
          </div>

          {/* Content - Using native overflow for reliable scrolling in flex container */}
          <div className="flex-1 overflow-y-auto">
            {selected && (
              <div className="p-6 space-y-8">
                {/* 1. Hero Card: Student Identity & Status */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50/50 via-white to-blue-50/20 dark:from-blue-900/10 dark:via-neutral-900 dark:to-neutral-800 border border-blue-100/50 dark:border-blue-900/20 p-6 shadow-sm">
                  <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-100/50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center font-bold text-xl shadow-inner border border-blue-200/50 dark:border-blue-800">
                        {selected.mahasiswa?.nama?.charAt(0) ?? "M"}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-blue-600/80 dark:text-blue-400 uppercase tracking-wider">
                          Mahasiswa
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                          {selected.mahasiswa?.nama ?? "-"}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          NIM: {selected.mahasiswa?.nim ?? "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 bg-white/60 dark:bg-neutral-800/60 p-2 rounded-xl border border-gray-100 dark:border-neutral-700 text-right backdrop-blur-sm">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Status Kelulusan</span>
                      {(() => {
                        const affectedExams = ["seminar proposal", "ujian hasil", "ujian skripsi"];
                        const currentExamType = selected.jenisUjian?.namaJenis?.toLowerCase() || "";
                        const isExamRuleActive = affectedExams.some(t => currentExamType.includes(t));

                        // Check if any single score item is <= 60
                        const hasScoreBelowThreshold = penilaian.some((p: any) => (p.nilai ?? 0) <= 60);
                        const forcedFail = isExamRuleActive && hasScoreBelowThreshold;

                        // Determine display status
                        let displayStatus = selected.hasil ?? "Belum Ada Hasil";
                        if (forcedFail) displayStatus = "TIDAK LULUS";

                        const isLulus = displayStatus.toLowerCase() === "lulus";
                        const isTidakLulus = displayStatus.toLowerCase() === "tidak lulus";

                        return (
                          <span className={`px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-wide
                                ${isLulus
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                              : isTidakLulus
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }
                             `}>
                            {displayStatus}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  {/* Decor elements */}
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>
                </div>

                {/* 2. Main Content Stack (Vertical) */}
                <div className="flex flex-col gap-8">
                  {/* Exam Details Section */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                        <span className="p-1.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-gray-500"><List size={14} /></span>
                        Judul Penelitian
                      </h4>
                      <div className="p-4 bg-gray-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 rounded-xl">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed italic text-center sm:text-left">
                          "{selected.judulPenelitian ?? "-"}"
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase">Jenis Ujian</div>
                        <div className={`inline-flex items-center px-4 py-3 rounded-xl text-sm font-bold border gap-2 w-full justify-center sm:justify-start
                                ${selected.jenisUjian?.namaJenis?.toLowerCase().includes("proposal")
                            ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                            : selected.jenisUjian?.namaJenis?.toLowerCase().includes("hasil")
                              ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
                              : "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
                          }`}>
                          <Settings2 size={16} />
                          {selected.jenisUjian?.namaJenis ?? "-"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase">Tanggal Ujian</div>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-sm font-medium text-gray-700 dark:text-gray-300 w-full justify-center sm:justify-start">
                          <Calendar size={16} className="text-gray-400" />
                          {selected.jadwalUjian ? new Date(selected.jadwalUjian).toLocaleDateString("id-ID", { dateStyle: 'full' }) : "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score Card Section */}
                  <div>
                    <div className="rounded-3xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm">
                      {(() => {
                        const pengujiMap: Record<number, { total: number }> = {};
                        penilaian.forEach((p) => {
                          if (!pengujiMap[p.dosenId]) pengujiMap[p.dosenId] = { total: 0 };
                          const bobot = p.komponenPenilaian?.bobot ?? 0;
                          pengujiMap[p.dosenId].total += ((p.nilai ?? 0) * bobot) / 100;
                        });
                        const totalNilai = Object.values(pengujiMap).reduce(
                          (acc, cur) => acc + cur.total,
                          0
                        );
                        const jumlahPenguji = Object.keys(pengujiMap).length || 1;
                        const rataRata = totalNilai / jumlahPenguji;

                        // Rule Check
                        const affectedExams = ["seminar proposal", "ujian hasil", "ujian skripsi"];
                        const currentExamType = selected.jenisUjian?.namaJenis?.toLowerCase() || "";
                        const isExamRuleActive = affectedExams.some(t => currentExamType.includes(t));
                        const hasScoreBelowThreshold = penilaian.some((p: any) => (p.nilai ?? 0) <= 60);
                        const forcedFail = isExamRuleActive && hasScoreBelowThreshold;

                        let nilaiHuruf = getNilaiHuruf(rataRata);
                        if (forcedFail) nilaiHuruf = "E";

                        return (
                          <div className="flex flex-col sm:flex-row items-center justify-around gap-8">
                            <div className="relative shrink-0">
                              {/* Grade Circle */}
                              <div className={`w-32 h-32 rounded-full flex items-center justify-center text-7xl font-black shadow-2xl ring-8 ring-gray-50 dark:ring-neutral-800
                                              ${nilaiHuruf === 'A' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white' :
                                  nilaiHuruf === 'B' ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' :
                                    nilaiHuruf === 'C' ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' :
                                      'bg-gradient-to-br from-red-400 to-red-600 text-white'}
                                           `}>
                                {nilaiHuruf}
                              </div>
                              {/* Score Label */}
                              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-base font-bold px-4 py-1.5 rounded-full shadow-lg border border-gray-100 dark:border-neutral-700 whitespace-nowrap">
                                {selected.nilaiAkhir ?? "0.0"}
                              </div>
                            </div>

                            <div className="w-full sm:w-auto flex-1 max-w-sm space-y-4 text-center sm:text-left">
                              <div>
                                <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-1">Hasil Akhir</h5>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Mahasiswa memperoleh predikat <strong className="text-gray-900 dark:text-white">{nilaiHuruf}</strong> dengan nilai rata-rata <strong className="text-gray-900 dark:text-white">{rataRata.toFixed(2)}</strong>.
                                </p>
                                {forcedFail && (
                                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-100 dark:border-red-900/20">
                                    Status: TIDAK LULUS (Terdapat nilai kriteria ≤ 60)
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-800">
                                  <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">Total Nilai</span>
                                  <span className="font-mono font-bold text-gray-800 dark:text-gray-200 text-xl">{totalNilai.toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-800">
                                  <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">Rata-rata</span>
                                  <span className="font-mono font-bold text-gray-800 dark:text-gray-200 text-xl">{rataRata.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Footer with Actions */}
          <div className="p-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 flex justify-end gap-3 shrink-0">
            <DialogClose asChild>
              <Button variant="outline">Tutup</Button>
            </DialogClose>

            {selected?.hasil && (
              <>
                <Button
                  variant="outline"
                  onClick={() => selected && handleDownloadBeritaAcara(selected)}
                  className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 gap-2 shadow-sm"
                >
                  <Download size={16} />
                  Berita Acara
                </Button>
                <Button
                  variant="outline"
                  onClick={() => selected && handleDownloadDaftarHadir(selected)}
                  className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 gap-2 shadow-sm"
                >
                  <Download size={16} />
                  Daftar Hadir
                </Button>
              </>
            )}

            {selected?.hasil?.toLowerCase() === "lulus" && (
              <Button
                onClick={() => selected && handleDownloadSuratLulus(selected)}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm shadow-blue-500/20"
              >
                <Download size={16} />
                Surat Keterangan Lulus
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Catatan */}
      <Dialog open={openCatatanDialog} onOpenChange={setOpenCatatanDialog}>
        <DialogContent className="max-w-md bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="p-2 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <AlertCircle size={18} />
              </span>
              Catatan / Revisi Penguji
            </DialogTitle>
          </DialogHeader>

          <div className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-gray-100 dark:border-neutral-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {selectedCatatan}
            </p>
          </div>

          <DialogFooter className="mt-6">
            <Button
              onClick={() => setOpenCatatanDialog(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Search, Filter, and Tabs in one row (tabs below on mobile) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:gap-4 gap-2 mb-4">
        {/* Search and Filter */}

        <div className="flex w-full items-center gap-2 sm:gap-2">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <Input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg pl-10 pr-3 py-2 w-full bg-white dark:bg-neutral-800 text-sm"
            />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={handleDownloadRekapNilai}
                  className="h-9 px-3 gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 border-0"
                  title="Download Rekap Nilai Skripsi"
                >
                  <Download size={16} />
                  <span className="sr-only sm:not-sr-only">Rekap</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Rekap Nilai Skripsi</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center gap-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 grid place-items-center"
                  aria-label="Filter status"
                  title="Filter status"
                >
                  <Settings2 size={16} />
                </Button>
              </DropdownMenuTrigger>
              {/* Dropdown Content */}
              <DropdownMenuContent align="end" className="w-[200px] p-0">
                <ScrollArea className="max-h-[300px] p-1">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Jenis Ujian
                  </div>
                  {["all", "proposal", "hasil", "skripsi"].map((opt) => {
                    const isActive = jenisFilter === opt;
                    return (
                      <DropdownMenuItem
                        key={opt}
                        onClick={() => setJenisFilter(opt as any)}
                        className={`flex items-center justify-between text-sm px-2 py-1.5 cursor-pointer ${isActive ? "bg-accent text-accent-foreground font-medium" : ""
                          }`}
                      >
                        <span className="capitalize">{opt === "all" ? "Semua" : opt}</span>
                        {isActive && <Check size={14} />}
                      </DropdownMenuItem>
                    );
                  })}
                  <div className="my-1 h-px bg-border" />
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Hasil
                  </div>
                  {["all", "lulus", "tidak lulus"].map((opt) => {
                    const isActive = hasilFilter === opt;
                    return (
                      <DropdownMenuItem
                        key={opt}
                        onClick={() => setHasilFilter(opt as any)}
                        className={`flex items-center justify-between text-sm px-2 py-1.5 cursor-pointer ${isActive ? "bg-accent text-accent-foreground font-medium" : ""
                          }`}
                      >
                        <span className="capitalize">{opt === "all" ? "Semua" : opt}</span>
                        {isActive && <Check size={14} />}
                      </DropdownMenuItem>
                    );
                  })}
                  <div className="my-1 h-px bg-border" />
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Bulan
                  </div>
                  <div className="px-2 pb-2">
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={filterBulan === "all" ? "" : filterBulan}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFilterBulan(val === "" ? "all" : val);
                      }}
                      placeholder="Bulan (1-12)"
                      className="w-full px-2 py-1.5 border rounded text-sm bg-background"
                    />
                  </div>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Tahun
                  </div>
                  <div className="px-2 pb-2">
                    <input
                      type="number"
                      min={2000}
                      max={2100}
                      value={filterTahun === "all" ? "" : filterTahun}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFilterTahun(val === "" ? "all" : val);
                      }}
                      placeholder="Tahun"
                      className="w-full px-2 py-1.5 border rounded text-sm bg-background"
                    />
                  </div>
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="">
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as any)}
              className="sm:mb-0 h-9"
            >
              <TabsList>
                <TabsTrigger value="table">
                  <LayoutGrid size={16} />
                </TabsTrigger>
                <TabsTrigger value="card">
                  <List />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        {/* Tabs for view mode */}
      </div>

      {/* Table Mode */}
      {viewMode === "table" && <TableGlobal table={table} cols={cols} />}

      {/* Card Mode */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.length > 0 ? (
            paginatedData.map((ujian) => {


              const hasilColor = ujian.hasil?.toLowerCase() === 'lulus'
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200"
                : ujian.hasil?.toLowerCase() === 'tidak lulus'
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200"
                  : "bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-400 border-gray-200";

              return (
                <div
                  key={ujian.id}
                  className={`group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col`}
                >
                  <div className="p-5 flex flex-col gap-4 flex-1">

                    {/* Header: Date & Result */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          <Calendar size={13} />
                          <span>
                            {ujian.jadwalUjian
                              ? new Date(ujian.jadwalUjian).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })
                              : "Tgl -"}
                          </span>
                        </div>
                      </div>

                      {ujian.hasil ? (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${hasilColor}`}>
                          {ujian.hasil}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Belum Dinilai</span>
                      )}
                    </div>

                    {/* Content: Title & Name */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2" title={ujian.judulPenelitian}>
                        {ujian.judulPenelitian || "Judul tidak tersedia"}
                      </h3>

                      <div className="flex items-center gap-2 pt-1">
                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                          {ujian.mahasiswa?.nama?.charAt(0) ?? "?"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                            {ujian.mahasiswa?.nama ?? "-"}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {ujian.mahasiswa?.nim ?? "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Info: Type & Grade */}
                    <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 dark:border-neutral-800">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold 
                             ${ujian.jenisUjian?.namaJenis?.toLowerCase().includes("proposal") ? "bg-blue-100 text-blue-700" :
                          ujian.jenisUjian?.namaJenis?.toLowerCase().includes("hasil") ? "bg-yellow-100 text-yellow-700" :
                            ujian.jenisUjian?.namaJenis?.toLowerCase().includes("skripsi") ? "bg-green-100 text-green-700" : "bg-gray-100"
                        }
                        `}>
                        {ujian.jenisUjian?.namaJenis ?? "-"}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Nilai:</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {ujian.nilaiAkhir ?? "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 flex items-center justify-end border-t border-gray-100 dark:border-neutral-800">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDetail(ujian)}
                      className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                    >
                      <MoreHorizontal size={14} className="mr-1.5" /> Detail
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 gap-3">
              <div className="p-4 rounded-full bg-gray-50 dark:bg-neutral-800">
                <List size={24} className="opacity-50" />
              </div>
              <p className="text-muted-foreground">Tidak ada data rekapitulasi nilai.</p>
            </div>
          )}
        </div>
      )}
    </DataCard>
  );
}
