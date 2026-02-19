import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllDosen } from "@/actions/data-master/dosen";
import { getKomponenPenilaianByUjianByPeran } from "@/actions/data-master/komponenPenilaian";
import { getAllUsers } from "@/actions/user";
import { getPenilaianByUjianId } from "@/actions/penilaian";

// Helper: Load Image
const getBase64ImageFromURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve("");
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
      console.error("Failed to load image", error);
      resolve("");
    };
    img.src = url;
  });
};

// Helper untuk konversi nilai ke huruf
function getNilaiHuruf(n: number): string {
  if (n >= 80) return "A";
  if (n >= 70) return "B";
  if (n >= 60) return "C";
  if (n >= 56) return "D";
  return "E";
}

// Main Export Function
export const downloadBerkasUjian = async (item: any) => {
  const doc = new jsPDF();
  const logoUrl = "/images/uin-raden-fatah.png";
  let logoData = "";
  try {
    logoData = await getBase64ImageFromURL(logoUrl);
  } catch (e) {
    console.error(e);
  }

  // 1. Rekapitulasi Nilai
  await generateRekapNilai(doc, item, logoData);

  // 2. Berita Acara
  doc.addPage();
  await generateBeritaAcara(doc, item, logoData);

  // 3. Daftar Hadir
  doc.addPage();
  await generateDaftarHadir(doc, item, logoData);

  // 4. Rekap Nilai per Dosen
  doc.addPage();
  await generateRekapNilaiPerDosen(doc, item, logoData);

  doc.save(`Berkas_Lengkap_Ujian_${item.mahasiswa?.nim || "Ujian"}.pdf`);
};

// --- PDF SECTIONS ---

async function generateRekapNilai(doc: jsPDF, item: any, logoData: string) {
  const mx = 15;
  let my = 15;

  // --- HEADER ---
  doc.setLineWidth(0.3);
  doc.rect(mx, my, 80, 25); // Logo + Institution Box
  if (logoData) doc.addImage(logoData, "PNG", mx + 2, my + 2, 21, 21);
  doc.setFont("times", "normal");
  doc.setFontSize(8);
  doc.text("UIN RADEN FATAH PALEMBANG", mx + 25, my + 6);
  doc.text("FAKULTAS SAINS DAN TEKNOLOGI", mx + 25, my + 11);
  doc.text("Jl. Prof. K.H. Zainal Abidin Fikry", mx + 25, my + 16);
  doc.text("Palembang", mx + 25, my + 21);

  const col2X = mx + 80;
  const col2Width = 100;
  doc.rect(col2X, my, col2Width, 8); // Row 1
  doc.line(col2X + 50, my, col2X + 50, my + 8);
  doc.text("Revisi 01", col2X + 25, my + 5, { align: "center" });
  doc.text("1 Agustus 2018", col2X + 75, my + 5, { align: "center" });

  doc.rect(col2X, my + 8, col2Width, 9); // Row 2
  doc.setFont("times", "normal");
  doc.text("Kode", col2X + 50, my + 11.5, { align: "center" });
  doc.setFont("times", "bold");
  doc.text("FST. FORM SKRIPSI 05", col2X + 50, my + 15, { align: "center" });

  doc.rect(col2X, my + 17, col2Width, 8); // Row 3
  doc.setFont("times", "normal");
  doc.text("Tgl. Terbit", col2X + 50, my + 20.5, { align: "center" });
  doc.text("1 Februari 2018", col2X + 50, my + 23.5, { align: "center" });

  my += 25;
  const jenisUjian = item.jenisUjian?.namaJenis || "";
  doc.rect(mx, my, 180, 10);
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text(`Formulir Rekapitulasi Nilai`, mx + 90, my + 5, {
    align: "center",
  });
  doc.text(`${jenisUjian}`, mx + 90, my + 9, { align: "center" });

  // --- STUDENT INFO ---
  my += 15;
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  const startXLabel = mx + 5;
  const startXColon = startXLabel + 35;
  const startXValue = startXColon + 5;

  const dateObj = item.jadwalUjian ? new Date(item.jadwalUjian) : new Date();
  const tglStr = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hari = item.hariUjian || "-";

  doc.text("Hari/Tanggal", startXLabel, my);
  doc.text(":", startXColon, my);
  doc.text(`${hari}/${tglStr}`, startXValue, my);
  my += 8;

  doc.text("Nama/NIM", startXLabel, my);
  doc.text(":", startXColon, my);
  doc.text(
    `${item.mahasiswa?.nama || ""}/${item.mahasiswa?.nim || ""}`,
    startXValue,
    my,
  );
  my += 8;

  doc.text(`Judul ${jenisUjian.split(" ")[1] || "Proposal"}`, startXLabel, my);
  doc.text(":", startXColon, my);
  const splitJudul = doc.splitTextToSize(item.judulPenelitian || "-", 135);
  doc.text(splitJudul, startXValue, my);
  my += splitJudul.length * 6 + 10;

  // --- TABLE RATINGS ---
  // Fetch individual scores
  const penilaianData = await getPenilaianByUjianId(item.id);
  const calcScoreForDosen = (dosenId: number) => {
    const dosenPenilaian = penilaianData.filter(
      (p: any) => p.dosenId === dosenId,
    );
    if (dosenPenilaian.length === 0) return 0;
    return dosenPenilaian.reduce((acc: number, p: any) => {
      // Perbaikan perhitungan bobot * skor
      // p.nilai adalah skor 0-100
      // p.komponenPenilaian.bobot adalah bobot (misal 20)
      // Konstribusi = (skor * bobot)/100
      return acc + (p.nilai * (p.komponenPenilaian?.bobot || 0)) / 100;
    }, 0);
  };

  const pengujiRoles = [
    { role: "Ketua Penguji", key: "ketua_penguji" },
    { role: "Sekretaris Penguji", key: "sekretaris_penguji" },
    { role: "Penguji I", key: "penguji_1" },
    { role: "Penguji II", key: "penguji_2" },
  ];

  const tableBody = pengujiRoles.map((role, i) => {
    const p = item.penguji.find((px: any) => px.peran === role.key);
    const score = p ? calcScoreForDosen(p.id) : 0;
    return [
      i + 1 + ".",
      p?.nama || "",
      role.role,
      score > 0 ? score.toFixed(2) : "-",
    ];
  });

  const totalScore = tableBody.reduce((acc, row) => {
    const val = parseFloat(row[3].toString());
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  const avgScore = totalScore / 4;
  const finalGrade = getNilaiHuruf(avgScore);

  tableBody.push([
    {
      content: "Total Angka Nilai",
      colSpan: 3,
      styles: { halign: "center", fontStyle: "bold" },
    },
    totalScore.toFixed(2),
  ]);
  tableBody.push([
    {
      content: "Nilai Rata-rata",
      colSpan: 3,
      styles: { halign: "center", fontStyle: "bold" },
    },
    avgScore.toFixed(2),
  ]);
  tableBody.push([
    {
      content: "Nilai Huruf",
      colSpan: 3,
      styles: { halign: "center", fontStyle: "bold" },
    },
    finalGrade,
  ]);

  autoTable(doc, {
    startY: my,
    head: [["No.", "Nama", "Jabatan", "Angka Nilai"]],
    body: tableBody as any,
    theme: "grid",
    margin: { left: mx },
    styles: { font: "times", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { cellWidth: 45 },
      3: { cellWidth: 45, halign: "center" },
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.1,
      halign: "center",
    },
  });

  my = (doc as any).lastAutoTable.finalY + 15;

  // --- SIGNATURE AND NOTES ---
  const dosenList = await getAllDosen();
  const targetNipClean = "197508012009122001";
  let kaprodi: any = dosenList.find(
    (d: any) => d.nip && d.nip.replace(/\s/g, "") === targetNipClean,
  );

  if (!kaprodi) {
    kaprodi = dosenList.find(
      (d: any) =>
        d.jabatan?.toLowerCase().includes("kaprodi") ||
        d.jabatan?.toLowerCase().includes("ketua program studi"),
    );
  }

  // Secondary fallback to users if still not found
  if (!kaprodi) {
    const users = await getAllUsers();
    kaprodi = users.find((u: any) =>
      u.roles?.some((r: any) => r.name.toLowerCase() === "kaprodi"),
    );
  }

  const footerX = 120;
  doc.text("Palembang, ", footerX, my);
  my += 6;
  doc.text("Ketua Program Studi,", footerX, my);
  my += 25;
  doc.setFont("times", "bold");
  doc.text(
    kaprodi?.nama || "(.......................................)",
    footerX,
    my,
  );
  my += 5;
  doc.setFont("times", "normal");
  doc.text(
    `NIP. ${kaprodi?.nip || kaprodi?.nip_nim || "......................................."}`,
    footerX,
    my,
  );

  // Notes
  my = (doc as any).lastAutoTable.finalY + 40;
  if (my > 260) {
    doc.addPage();
    my = 20;
  }
  doc.setFontSize(9);
  doc.text("Catatan interval nilai:", mx, my);
  my += 5;
  doc.text("A    : 80.00 – 100", mx, my);
  my += 5;
  doc.text("B    : 70.00 – 79.99", mx, my);
  my += 5;
  doc.text("C    : 60.00 – 69.99", mx, my);
  my += 5;
  doc.text("D    : 56.00 - 59.99", mx, my);
  my += 5;
  doc.text("E    : < 55.99", mx, my);
}

async function generateBeritaAcara(doc: jsPDF, item: any, logoData: string) {
  const mx = 15;
  let my = 15;

  // --- PAGE 1: BERITA ACARA ---
  // Header
  doc.setLineWidth(0.3);
  doc.rect(mx, my, 80, 25); // Logo + Institution Box
  if (logoData) doc.addImage(logoData, "PNG", mx + 2, my + 2, 21, 21);
  doc.setFont("times", "normal");
  doc.setFontSize(8);
  doc.text("UIN RADEN FATAH PALEMBANG", mx + 25, my + 6);
  doc.text("FAKULTAS SAINS DAN TEKNOLOGI", mx + 25, my + 11);
  doc.text("Jl. Prof. K.H. Zainal Abidin Fikry", mx + 25, my + 16);
  doc.text("Palembang", mx + 25, my + 21);

  const col2X = mx + 80;
  const col2Width = 100;
  doc.rect(col2X, my, col2Width, 8); // Row 1
  doc.line(col2X + 50, my, col2X + 50, my + 8);
  doc.text("Revisi 01", col2X + 25, my + 5, { align: "center" });
  doc.text("1 Agustus 2018", col2X + 75, my + 5, { align: "center" });

  doc.rect(col2X, my + 8, col2Width, 9); // Row 2
  doc.setFont("times", "normal");
  doc.text("Kode", col2X + 50, my + 11.5, { align: "center" });
  doc.setFont("times", "bold");
  doc.text("FST. FORM SKRIPSI 03", col2X + 50, my + 15, { align: "center" });

  doc.rect(col2X, my + 17, col2Width, 8); // Row 3
  doc.setFont("times", "normal");
  doc.text("Tgl. Terbit", col2X + 50, my + 20.5, { align: "center" });
  doc.text("1 Februari 2018", col2X + 50, my + 23.5, { align: "center" });

  my += 25;
  const jenisUjian = item.jenisUjian?.namaJenis?.toUpperCase() || "";
  doc.rect(mx, my, 180, 8);
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text(`Formulir Berita Acara Ujian ${jenisUjian}`, mx + 3, my + 5.5);

  // Title
  my += 15;
  doc.setFontSize(12);
  doc.text(`BERITA ACARA UJIAN ${jenisUjian}`, 105, my, { align: "center" });

  // Body
  my += 10;
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  const dateObj = item.jadwalUjian ? new Date(item.jadwalUjian) : new Date();
  const hari = item.hariUjian || "...";
  const tgl = dateObj.getDate() || "...";
  const blnArr = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const bln = blnArr[dateObj.getMonth()] || "...";
  const thn = dateObj.getFullYear() || "...";

  doc.text(
    `Pada hari ini ${hari}, tanggal ${tgl}, bulan ${bln}, tahun ${thn} telah dilaksanakan ujian ${item.jenisUjian?.namaJenis?.toLowerCase() || "..."} skripsi:`,
    mx,
    my,
  );

  my += 10;
  const startXValue = mx + 35;
  doc.text("Nama", mx + 5, my);
  doc.text(":", mx + 30, my);
  doc.text(item.mahasiswa?.nama || "-", startXValue, my);
  my += 7;
  doc.text("NIM", mx + 5, my);
  doc.text(":", mx + 30, my);
  doc.text(item.mahasiswa?.nim || "-", startXValue, my);
  my += 7;
  doc.text("Program Studi", mx + 5, my);
  doc.text(":", mx + 30, my);
  doc.text(
    item.mahasiswa?.prodi?.namaProdi?.toUpperCase() || "-",
    startXValue,
    my,
  );
  my += 7;
  doc.text("Judul", mx + 5, my);
  doc.text(":", mx + 30, my);
  const splitJudul = doc.splitTextToSize(item.judulPenelitian || "-", 140);
  doc.text(splitJudul, startXValue, my);

  my += splitJudul.length * 6 + 10;
  doc.text("Tim Penguji:", mx, my);
  my += 2;

  // Tim Penguji Table
  const pengujiRows = [
    {
      role: "Ketua Penguji",
      name:
        item.penguji.find((p: any) => p.peran === "ketua_penguji")?.nama || "",
    },
    {
      role: "Sekretaris Penguji",
      name:
        item.penguji.find((p: any) => p.peran === "sekretaris_penguji")?.nama ||
        "",
    },
    {
      role: "Penguji I",
      name: item.penguji.find((p: any) => p.peran === "penguji_1")?.nama || "",
    },
    {
      role: "Penguji II",
      name: item.penguji.find((p: any) => p.peran === "penguji_2")?.nama || "",
    },
  ];

  autoTable(doc, {
    startY: my,
    head: [["No.", "Nama", "Jabatan", "Tanda Tangan"]],
    body: pengujiRows.map((p, i) => [i + 1 + ".", p.name, p.role, ""]),
    theme: "grid",
    margin: { left: mx },
    styles: { font: "times", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { cellWidth: 45 },
      3: { cellWidth: 45 },
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.1,
    },
  });

  my = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont("times", "bold");
  doc.text("MEMUTUSKAN:", mx, my);
  doc.setFont("times", "normal");
  const decision =
    item.hasil?.toLowerCase() === "lulus"
      ? "DITERIMA"
      : item.hasil?.toLowerCase() === "tidak lulus"
        ? "DITOLAK"
        : "DITERIMA / DITOLAK";
  doc.text(
    ` ${item.jenisUjian?.namaJenis || "Proposal"} saudara dinyatakan ${decision} dengan catatan terlampir.`,
    mx + 28,
    my,
  );

  my += 15;
  const footerX = 130;
  doc.text("Ditetapkan di: Palembang", footerX, my);
  my += 5;
  doc.text(
    `Pada tanggal: ${item.jadwalUjian ? new Date(item.jadwalUjian).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}`,
    footerX,
    my,
  );

  my += 15;
  doc.text("Ketua Penguji,", mx + 20, my);
  doc.text("Sekretaris Penguji,", footerX, my);

  // --- PAGE 2: LAMPIRAN ---
  doc.addPage();
  my = 20;
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text(
    `LAMPIRAN: BERITA ACARA PELAKSANAAN UJIAN ${jenisUjian} SKRIPSI`,
    mx,
    my,
  );

  my += 10;
  doc.setFont("times", "normal");
  doc.text("Nama Mahasiswa", mx, my);
  doc.text(":", mx + 35, my);
  doc.text(item.mahasiswa?.nama || "-", mx + 40, my);
  my += 7;
  doc.text("NIM", mx, my);
  doc.text(":", mx + 35, my);
  doc.text(item.mahasiswa?.nim || "-", mx + 40, my);

  my += 10;
  doc.text("Catatan/Daftar Revisi Penguji:", mx, my);
  my += 5;

  // Table with many empty rows for manual note or data
  const listRevisi = item.catatan
    ? [{ name: "Dosen", text: item.catatan }]
    : [];
  const tableBody = [];
  // Add existing catatan if any
  listRevisi.forEach((r: any, i: number) => {
    tableBody.push([i + 1 + ".", r.name, r.text, ""]);
  });
  // Add empty rows to total 15 rows for filling
  for (let i = tableBody.length; i < 15; i++) {
    // @ts-ignore
    tableBody.push([i + 1 + ".", "", "", ""]);
  }

  autoTable(doc, {
    startY: my,
    head: [["No.", "Nama Penguji", "Uraian", "Tanda Tangan"]],
    body: tableBody as any,
    theme: "grid",
    margin: { left: mx },
    styles: { font: "times", fontSize: 9, cellPadding: 2, minCellHeight: 10 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 45 },
      2: { cellWidth: 85 },
      3: { cellWidth: 40 },
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.1,
    },
  });

  my = (doc as any).lastAutoTable.finalY + 15;
  doc.text("Palembang, ", footerX, my);
  my += 5;
  doc.text("Sekretaris Penguji,", footerX, my);
}

async function generateDaftarHadir(doc: jsPDF, item: any, logoData: string) {
  const mx = 15;
  let my = 15;

  // --- HEADER ---
  doc.setLineWidth(0.3);
  doc.rect(mx, my, 80, 25); // Logo + Institution Box
  if (logoData) doc.addImage(logoData, "PNG", mx + 2, my + 2, 21, 21);
  doc.setFont("times", "normal");
  doc.setFontSize(8);
  doc.text("UIN RADEN FATAH PALEMBANG", mx + 25, my + 6);
  doc.text("FAKULTAS SAINS DAN TEKNOLOGI", mx + 25, my + 11);
  doc.text("Jl. Prof. K.H. Zainal Abidin Fikry", mx + 25, my + 16);
  doc.text("Palembang", mx + 25, my + 21);

  const col2X = mx + 80;
  const col2Width = 100;
  doc.rect(col2X, my, col2Width, 8); // Row 1
  doc.line(col2X + 50, my, col2X + 50, my + 8);
  doc.text("Revisi 01", col2X + 25, my + 5, { align: "center" });
  doc.text("1 Agustus 2018", col2X + 75, my + 5, { align: "center" });

  doc.rect(col2X, my + 8, col2Width, 9); // Row 2
  doc.setFont("times", "normal");
  doc.text("Kode", col2X + 50, my + 11.5, { align: "center" });
  doc.setFont("times", "bold");
  doc.text("FST. FORM SKRIPSI 04", col2X + 50, my + 15, { align: "center" });

  doc.rect(col2X, my + 17, col2Width, 8); // Row 3
  doc.setFont("times", "normal");
  doc.text("Tgl. Terbit", col2X + 50, my + 20.5, { align: "center" });
  doc.text("1 Februari 2018", col2X + 50, my + 23.5, { align: "center" });

  my += 25;
  const jenisUjian = item.jenisUjian?.namaJenis || "";
  doc.rect(mx, my, 180, 8);
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text(`Formulir Daftar Hadir ${jenisUjian}`, mx + 3, my + 5.5);

  // --- STUDENT INFO ---
  my += 15;
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  const startXLabel = mx + 5;
  const startXColon = startXLabel + 35;
  const startXValue = startXColon + 5;

  const dateObj = item.jadwalUjian ? new Date(item.jadwalUjian) : new Date();
  const tglStr = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hari = item.hariUjian || "-";

  doc.text("Hari/Tanggal", startXLabel, my);
  doc.text(":", startXColon, my);
  doc.text(`${hari}/${tglStr}`, startXValue, my);
  my += 8;

  const waktuMulai = item.waktuMulai ? item.waktuMulai.slice(0, 5) : "-";
  const waktuSelesai = item.waktuSelesai ? item.waktuSelesai.slice(0, 5) : "-";
  doc.text("Waktu", startXLabel, my);
  doc.text(":", startXColon, my);
  doc.text(`${waktuMulai} - ${waktuSelesai}`, startXValue, my);
  my += 8;

  doc.text("Nama Mahasiswa", startXLabel, my);
  doc.text(":", startXColon, my);
  doc.text(item.mahasiswa?.nama || "-", startXValue, my);
  my += 8;

  doc.text("NIM", startXLabel, my);
  doc.text(":", startXColon, my);
  doc.text(item.mahasiswa?.nim || "-", startXValue, my);
  my += 8;

  doc.text(`Judul ${jenisUjian.split(" ")[1] || "Proposal"}`, startXLabel, my);
  doc.text(":", startXColon, my);
  const splitJudul = doc.splitTextToSize(item.judulPenelitian || "-", 135);
  doc.text(splitJudul, startXValue, my);
  my += splitJudul.length * 6 + 5;

  doc.text("Tanda Tangan", startXLabel, my);
  doc.text(":", startXColon, my);
  doc.text(
    "....................................................",
    startXValue,
    my,
  );

  my += 15;

  // --- TIM PENGUJI TABLE ---
  const pengujiRows = [
    {
      role: "Ketua Penguji",
      name:
        item.penguji.find((p: any) => p.peran === "ketua_penguji")?.nama || "",
      nip:
        item.penguji.find((p: any) => p.peran === "ketua_penguji")?.nip || "",
    },
    {
      role: "Sekretaris Penguji",
      name:
        item.penguji.find((p: any) => p.peran === "sekretaris_penguji")?.nama ||
        "",
      nip:
        item.penguji.find((p: any) => p.peran === "sekretaris_penguji")?.nip ||
        "",
    },
    {
      role: "Penguji I",
      name: item.penguji.find((p: any) => p.peran === "penguji_1")?.nama || "",
      nip: item.penguji.find((p: any) => p.peran === "penguji_1")?.nip || "",
    },
    {
      role: "Penguji II",
      name: item.penguji.find((p: any) => p.peran === "penguji_2")?.nama || "",
      nip: item.penguji.find((p: any) => p.peran === "penguji_2")?.nip || "",
    },
  ];

  autoTable(doc, {
    startY: my,
    head: [["No.", "Nama", "NIP/NIDN", "Jabatan", "Tanda Tangan"]],
    body: pengujiRows.map((p, i) => [i + 1 + ".", p.name, p.nip, p.role, ""]),
    theme: "grid",
    margin: { left: mx },
    styles: { font: "times", fontSize: 9, cellPadding: 3, minCellHeight: 12 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 60 },
      2: { cellWidth: 40 },
      3: { cellWidth: 35 },
      4: { cellWidth: 35 },
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.1,
      halign: "center",
    },
  });

  my = (doc as any).lastAutoTable.finalY + 15;
  const footerX = 130;
  const dosenList = await getAllDosen();
  const targetNipClean = "197508012009122001";
  let kaprodi: any = dosenList.find(
    (d: any) => d.nip && d.nip.replace(/\s/g, "") === targetNipClean,
  );

  if (!kaprodi) {
    kaprodi = dosenList.find(
      (d: any) =>
        d.jabatan?.toLowerCase().includes("kaprodi") ||
        d.jabatan?.toLowerCase().includes("ketua program studi"),
    );
  }

  // Secondary fallback to users
  if (!kaprodi) {
    const users = await getAllUsers();
    kaprodi = users.find((u: any) =>
      u.roles?.some((r: any) => r.name.toLowerCase() === "kaprodi"),
    );
  }

  doc.text("Palembang, ", footerX, my);
  my += 6;
  doc.text("Ketua Program Studi,", footerX, my);
  my += 25;
  doc.setFont("times", "bold");
  doc.text(
    kaprodi?.nama || "(.......................................)",
    footerX,
    my,
  );
  my += 5;
  doc.setFont("times", "normal");
  doc.text(
    `NIP. ${kaprodi?.nip || kaprodi?.nip_nim || "......................................."}`,
    footerX,
    my,
  );
}

async function generateRekapNilaiPerDosen(
  doc: jsPDF,
  item: any,
  logoData: string,
) {
  const mx = 15;
  // Fetch individual scores
  const penilaianData = await getPenilaianByUjianId(item.id);

  const roles = [
    { key: "ketua_penguji", label: "Ketua Penguji" },
    { key: "sekretaris_penguji", label: "Sekretaris Penguji" },
    { key: "penguji_1", label: "Penguji I" },
    { key: "penguji_2", label: "Penguji II" },
  ];

  let rIdx = 0;
  for (const role of roles) {
    if (rIdx > 0) doc.addPage();
    rIdx++;
    let my = 15;

    // --- HEADER ---
    doc.setLineWidth(0.3);
    doc.rect(mx, my, 80, 25); // Logo + Institution Box
    if (logoData) doc.addImage(logoData, "PNG", mx + 2, my + 2, 21, 21);
    doc.setFont("times", "normal");
    doc.setFontSize(8);
    doc.text("UIN RADEN FATAH PALEMBANG", mx + 25, my + 6);
    doc.text("FAKULTAS SAINS DAN TEKNOLOGI", mx + 25, my + 11);
    doc.text("Jl. Prof. K.H. Zainal Abidin Fikry", mx + 25, my + 16);
    doc.text("Palembang", mx + 25, my + 21);

    const col2X = mx + 80;
    const col2Width = 100;
    doc.rect(col2X, my, col2Width, 8); // Row 1
    doc.line(col2X + 50, my, col2X + 50, my + 8);
    doc.text("Revisi 01", col2X + 25, my + 5, { align: "center" });
    doc.text("1 Agustus 2018", col2X + 75, my + 5, { align: "center" });

    doc.rect(col2X, my + 8, col2Width, 9); // Row 2
    doc.setFont("times", "normal");
    doc.text("Kode", col2X + 50, my + 11.5, { align: "center" });
    doc.setFont("times", "bold");
    doc.text("FST. FORM SKRIPSI 06", col2X + 50, my + 15, {
      align: "center",
    });

    doc.rect(col2X, my + 17, col2Width, 8); // Row 3
    doc.setFont("times", "normal");
    doc.text("Tgl. Terbit", col2X + 50, my + 20.5, { align: "center" });
    doc.text("1 Februari 2018", col2X + 50, my + 23.5, { align: "center" });

    my += 25;
    const jenisUjian = item.jenisUjian?.namaJenis || "";
    doc.rect(mx, my, 180, 12);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text(`Formulir Nilai Ujian ${jenisUjian}`, mx + 90, my + 5, {
      align: "center",
    });
    doc.text(`${role.label}`, mx + 90, my + 10, { align: "center" });

    // --- STUDENT INFO ---
    my += 17;
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    const startXLabel = mx + 5;
    const startXColon = startXLabel + 30;
    const startXValue = startXColon + 5;

    const pengujiItem = item.penguji.find(
      (p: any) => p.peran === role.key,
    ) as any;

    doc.text("Nama", startXLabel, my);
    doc.text(":", startXColon, my);
    doc.text(item.mahasiswa?.nama || "-", startXValue, my);
    my += 7;
    doc.text("NIM", startXLabel, my);
    doc.text(":", startXColon, my);
    doc.text(item.mahasiswa?.nim || "-", startXValue, my);
    my += 7;
    doc.text("Program Studi", startXLabel, my);
    doc.text(":", startXColon, my);
    doc.text(item.mahasiswa?.prodi?.namaProdi || "-", startXValue, my);
    my += 7;
    doc.text(role.label, startXLabel, my);
    doc.text(":", startXColon, my);
    doc.text(pengujiItem?.nama || "-", startXValue, my);
    my += 7;

    // --- TABLE ---
    const jUId = item.pendaftaranUjian?.jenisUjianId || item.jenisUjian?.id;
    const expectedKomp = await getKomponenPenilaianByUjianByPeran(
      jUId,
      role.key,
    );
    const dosenPenilaian = penilaianData.filter(
      (p: any) => Number(p.dosenId) === Number(pengujiItem?.id),
    );

    const tableBody = expectedKomp.map((komp: any) => {
      const p = dosenPenilaian.find(
        (px: any) => Number(px.komponenPenilaianId) === Number(komp.id),
      );
      const score = p?.nilai || 0;
      const bobot = komp.bobot || 0;
      const weighted = (score * bobot) / 100;
      return [
        { content: komp.namaKomponen || "-", colSpan: 1 },
        { content: komp.deskripsi || "-", colSpan: 1 },
        bobot,
        score > 0 ? score : "-",
        weighted > 0 ? weighted.toFixed(2) : "-",
      ];
    });

    const totalWeighted = expectedKomp.reduce((acc: number, komp: any) => {
      const p = dosenPenilaian.find(
        (px: any) => Number(px.komponenPenilaianId) === Number(komp.id),
      );
      const score = p?.nilai || 0;
      const bobot = komp.bobot || 0;
      return acc + (score * bobot) / 100;
    }, 0);

    tableBody.push([
      { content: "Skor Akhir", styles: { fontStyle: "bold" } },
      { content: "Total", styles: { halign: "center" } },
      100,
      "",
      { content: totalWeighted.toFixed(2), styles: { fontStyle: "bold" } },
    ]);

    autoTable(doc, {
      startY: my,
      head: [
        [
          "Kriteria",
          "Indikator Penilaian",
          "Bobot (%)",
          "Skor",
          "Bobot * Skor",
        ],
      ],
      body: tableBody as any,
      theme: "grid",
      styles: { font: "times", fontSize: 9, cellPadding: 2 },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        halign: "center",
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 70 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 25, halign: "center" },
        4: { cellWidth: 30, halign: "center" },
      },
    });

    my = (doc as any).lastAutoTable.finalY + 15;
    const footerX = 120;
    doc.text("Palembang, ", footerX, my);
    my += 6;
    doc.text(`${role.label},`, footerX, my);
    my += 25;
    doc.setFont("times", "bold");
    doc.text(
      pengujiItem?.nama || "(.......................................)",
      footerX,
      my,
    );
    my += 5;
    doc.setFont("times", "normal");
    doc.text(
      `NIP. ${pengujiItem?.nip || pengujiItem?.nip_nim || "......................................."}`,
      footerX,
      my,
    );

    my = (doc as any).lastAutoTable.finalY + 45;
    if (my > 240) {
      doc.addPage();
      my = 20;
    }
    doc.setFontSize(9);
    doc.text("Catatan interval nilai:", mx, my);
    my += 5;
    doc.text("A    : 80.00 – 100", mx, my);
    my += 5;
    doc.text("B    : 70.00 – 79.99", mx, my);
    my += 5;
    doc.text("C    : 60.00 – 69.99", mx, my);
    my += 5;
    doc.text("D    : 56.00 - 59.99", mx, my);
    my += 5;
    doc.text("E    : < 55.99", mx, my);
  }
}
