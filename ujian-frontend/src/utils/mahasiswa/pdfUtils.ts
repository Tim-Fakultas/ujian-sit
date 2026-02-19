import jsPDF from "jspdf";
import "jspdf-autotable";
import { BeritaUjian } from "@/types/BeritaUjian";
import { getAllDosen } from "@/actions/data-master/dosen";
import { getAllUsers } from "@/actions/user";
import { showToast } from "@/components/ui/custom-toast";
import { Ujian } from "@/types/Ujian";

// Helper: Load Image
export const getBase64ImageFromURL = (url: string): Promise<string> => {
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
      console.error("Failed to load image", error);
      resolve("");
    };
    img.src = url;
  });
};

export function getNilaiHuruf(n: number): string {
  if (n >= 80) return "A";
  if (n >= 70) return "B";
  if (n >= 60) return "C";
  if (n >= 56) return "D";
  return "E";
}

export const generateSuratLulusPdf = async (item: BeritaUjian) => {
  const doc = new jsPDF();
  const logoUrl = "/images/uin-raden-fatah.png";
  let logoData = "";
  try {
    logoData = await getBase64ImageFromURL(logoUrl);
  } catch (e) {
    console.error(e);
  }

  const rawType = item.jenisUjian?.namaJenis?.toLowerCase() || "";
  let examName = "Ujian";
  if (rawType.includes("proposal")) examName = "Ujian Seminar Proposal Skripsi";
  else if (rawType.includes("hasil")) examName = "Ujian Seminar Hasil Skripsi";
  else if (rawType.includes("skripsi")) examName = "Ujian Skripsi";
  else examName = item.jenisUjian?.namaJenis || "Ujian";

  const margin = 15;
  const startY = 15;
  const boxW = 180;
  const infoW = 95;
  const logoW = 30;
  const metaW = boxW - logoW - infoW;

  const h1 = 25;
  const h2 = 10;

  doc.rect(margin, startY, logoW, h1);
  if (logoData) {
    doc.addImage(logoData, "PNG", margin + 2, startY + 2, 26, 21);
  }

  doc.rect(margin + logoW, startY, infoW, h1);
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  const textX = margin + logoW + infoW / 2;
  let textY = startY + 6;
  doc.text("UIN RADEN FATAH PALEMBANG", textX, textY, { align: "center" });
  textY += 5;
  doc.text("FAKULTAS SAINS DAN TEKNOLOGI", textX, textY, { align: "center" });
  textY += 5;
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.text("Jl. Prof. K. H. Zainal Abidin Fikry", textX, textY, {
    align: "center",
  });
  textY += 4;
  doc.text("Palembang", textX, textY, { align: "center" });

  const rightX = margin + logoW + infoW;
  const hRight1 = 7;
  doc.rect(rightX, startY, metaW, hRight1);

  const halfMeta = metaW / 2;
  doc.line(rightX + halfMeta, startY, rightX + halfMeta, startY + hRight1);

  doc.setFontSize(8);
  doc.text("Revisi 01", rightX + halfMeta / 2, startY + 5, {
    align: "center",
  });
  doc.text("1 Agustus 2018", rightX + halfMeta + halfMeta / 2, startY + 5, {
    align: "center",
  });

  const hRight2 = h1 - hRight1;
  doc.rect(rightX, startY + hRight1, metaW, hRight2);

  doc.text("Kode", rightX + metaW / 2, startY + hRight1 + 5, {
    align: "center",
  });
  doc.setFont("times", "bold");
  doc.text("FST. FORM SKRIPSI 11", rightX + metaW / 2, startY + hRight1 + 10, {
    align: "center",
  });

  const wBottomLeft = logoW + infoW;
  doc.rect(margin, startY + h1, wBottomLeft, h2);
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text(
    "Surat Keterangan Lulus",
    margin + wBottomLeft / 2,
    startY + h1 + 4,
    { align: "center" },
  );
  doc.text(examName, margin + wBottomLeft / 2, startY + h1 + 8, {
    align: "center",
  });

  doc.rect(rightX, startY + h1, metaW, h2);
  doc.setFont("times", "normal");
  doc.setFontSize(8);
  doc.text("Tgl. Terbit", rightX + metaW / 2, startY + h1 + 4, {
    align: "center",
  });
  doc.text("1 Pebruari 2018", rightX + metaW / 2, startY + h1 + 8, {
    align: "center",
  });

  let y = startY + h1 + h2 + 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const hari = item.hariUjian
    ? item.hariUjian.charAt(0).toUpperCase() + item.hariUjian.slice(1)
    : "....................";
  const tanggal = item.jadwalUjian
    ? new Date(item.jadwalUjian).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ".......................";
  const waktuMulai = item.waktuMulai ? item.waktuMulai.slice(0, 5) : ".....";
  const waktuSelesai = item.waktuSelesai
    ? item.waktuSelesai.slice(0, 5)
    : ".....";

  doc.text(
    `Pada hari ini ${hari} tanggal ${tanggal}, telah berlangsung ${examName.toLowerCase()}`,
    20,
    y,
  );
  y += 6;
  doc.text("mahasiswa:", 20, y);
  y += 10;

  const labelX = 30;
  const colonX = 70;
  const valueX = 75;

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

  doc.text(
    `Ujian berlangsung dari pukul ${waktuMulai} WIB, sampai dengan ${waktuSelesai} WIB`,
    20,
    y,
  );
  y += 10;

  doc.text("Dosen Pembimbing I", labelX, y);
  doc.text(":", colonX, y);
  doc.text(
    item.mahasiswa?.pembimbing1?.nama ||
      "........................................................................",
    valueX,
    y,
  );
  y += 7;

  doc.text("Dosen Pembimbing II", labelX, y);
  doc.text(":", colonX, y);
  doc.text(
    item.mahasiswa?.pembimbing2?.nama ||
      "........................................................................",
    valueX,
    y,
  );
  y += 12;

  doc.text("Penguji:", 20, y);
  y += 8;

  const ketua =
    item.penguji?.find((p) => p.peran === "ketua_penguji")?.nama ||
    "........................................................................";
  const sekretaris =
    item.penguji?.find((p) => p.peran === "sekretaris_penguji")?.nama ||
    "........................................................................";
  const penguji1 =
    item.penguji?.find((p) => p.peran === "penguji_1")?.nama ||
    "........................................................................";
  const penguji2 =
    item.penguji?.find((p) => p.peran === "penguji_2")?.nama ||
    "........................................................................";

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

  doc.text(
    `Dari hasil ${examName} tersebut memutuskan bahwa yang bersangkutan dinyatakan:`,
    20,
    y,
  );
  y += 12;

  const nilai = item.nilaiAkhir ? Number(item.nilaiAkhir).toFixed(2) : "......";
  const huruf = item.nilaiAkhir
    ? getNilaiHuruf(Number(item.nilaiAkhir))
    : "......";

  doc.setFont("helvetica", "bold");
  doc.text(`LULUS dengan nilai: ${nilai} (${huruf})`, 105, y, {
    align: "center",
  });
  doc.setFont("helvetica", "normal");
  y += 12;

  doc.text(
    `Demikian Surat Keterangan ini dibuat sebagai bukti dari hasil ${examName}.`,
    20,
    y,
  );
  y += 20;

  const signBlockX = 120;
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  doc.text(`Palembang, ${today}`, signBlockX, y);
  y += 6;
  doc.text("Mengetahui,", signBlockX, y);
  y += 6;
  doc.text("Ketua Program Studi,", signBlockX, y);
  y += 30;

  doc.text("Gusmelia Testiana, M.Kom.", signBlockX, y);
  y += 6;
  doc.text("NIP. 1234567890", signBlockX, y);

  doc.save(`Surat_Keterangan_Lulus_${item.mahasiswa?.nim || "mahasiswa"}.pdf`);
};

export const generateBeritaAcaraPdf = async (item: BeritaUjian) => {
  const doc = new jsPDF();
  const logoUrl = "/images/uin-raden-fatah.png";
  let logoData = "";
  try {
    logoData = await getBase64ImageFromURL(logoUrl);
  } catch (e) {
    console.error("Error loading logo:", e);
  }

  const mx = 15;
  let my = 15;
  const contentWidth = 180;
  const cw = [10, 80, 50, 40];
  const rowHeight = 10;

  doc.setLineWidth(0.3);
  doc.rect(mx, my, 100, 25);
  if (logoData) {
    doc.addImage(logoData, "PNG", mx + 2, my + 2, 21, 21);
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
  const formTitle = item.jenisUjian?.namaJenis
    ?.toLowerCase()
    .includes("proposal")
    ? "Formulir Berita Acara Ujian Seminar Proposal"
    : "Formulir Berita Acara Ujian Skripsi";
  doc.text(formTitle, mx + 2, my + 5.5);

  my += 15;

  doc.setFontSize(12);
  doc.setFont("times", "bold");
  const docTitle = item.jenisUjian?.namaJenis
    ?.toLowerCase()
    .includes("proposal")
    ? "BERITA ACARA UJIAN SEMINAR PROPOSAL"
    : "BERITA ACARA UJIAN SKRIPSI";
  doc.text(docTitle, 105, my, { align: "center" });

  my += 10;
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  const hari = item.hariUjian
    ? item.hariUjian.charAt(0).toUpperCase() + item.hariUjian.slice(1)
    : "...";
  const tanggal = item.jadwalUjian
    ? new Date(item.jadwalUjian).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "...";
  doc.text(
    `Pada hari ini ${hari}, tanggal ${tanggal} telah dilaksanakan ${item.jenisUjian?.namaJenis?.toLowerCase() || "skripsi"}:`,
    mx,
    my,
  );

  my += 8;
  const startXLabel = mx + 10;
  const startXColon = startXLabel + 35;
  const startXValue = startXColon + 5;

  const labels = [
    { l: "Nama", v: item.mahasiswa?.nama || "" },
    { l: "NIM", v: item.mahasiswa?.nim || "" },
    {
      l: "Program Studi",
      v: item.mahasiswa?.prodi?.namaProdi?.toUpperCase() || "",
    },
    { l: "Judul", v: item.judulPenelitian || "" },
  ];
  labels.forEach((row) => {
    doc.text(row.l, startXLabel, my);
    doc.text(":", startXColon, my);
    if (row.l === "Judul") {
      const splitTitle = doc.splitTextToSize(row.v, 120);
      doc.text(splitTitle, startXValue, my);
      my += splitTitle.length * 6;
    } else {
      doc.text(row.v, startXValue, my);
      my += 8;
    }
  });

  if (item.jenisUjian?.namaJenis?.toLowerCase().includes("proposal")) {
    doc.text("Proposal", startXLabel, my);
    my += 8;
  }

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
  doc.text("Jabatan", tableX + cw[0] + cw[1] + cw[2] / 2, my + 5, {
    align: "center",
  });
  doc.text("Tanda Tangan", tableX + cw[0] + cw[1] + cw[2] + cw[3] / 2, my + 5, {
    align: "center",
  });
  my += headerHeight;

  const pengujiListBA = [
    {
      role: "Ketua Penguji",
      name: item.penguji?.find((p) => p.peran === "ketua_penguji")?.nama || "",
    },
    {
      role: "Sekretaris Penguji",
      name:
        item.penguji?.find((p) => p.peran === "sekretaris_penguji")?.nama || "",
    },
    {
      role: "Penguji I",
      name: item.penguji?.find((p) => p.peran === "penguji_1")?.nama || "",
    },
    {
      role: "Penguji II",
      name: item.penguji?.find((p) => p.peran === "penguji_2")?.nama || "",
    },
  ];

  pengujiListBA.forEach((p, idx) => {
    const noStr = (idx + 1).toString() + ".";
    const nameLines = doc.splitTextToSize(p.name, cw[1] - 4);
    const roleLines = doc.splitTextToSize(p.role, cw[2] - 4);
    const maxLines = Math.max(nameLines.length, roleLines.length);
    const currentHeight = Math.max(rowHeight, 4 + maxLines * 5);

    doc.rect(tableX, my, cw[0], currentHeight);
    doc.rect(tableX + cw[0], my, cw[1], currentHeight);
    doc.rect(tableX + cw[0] + cw[1], my, cw[2], currentHeight);
    doc.rect(tableX + cw[0] + cw[1] + cw[2], my, cw[3], currentHeight);

    doc.text(noStr, tableX + cw[0] / 2, my + currentHeight / 2 + 1.5, {
      align: "center",
    });
    doc.text(
      nameLines,
      tableX + 2 + cw[0],
      my + (currentHeight - nameLines.length * 5) / 2 + 4,
    );
    doc.text(
      roleLines,
      tableX + cw[0] + cw[1] + cw[2] / 2,
      my + (currentHeight - roleLines.length * 5) / 2 + 4,
      { align: "center" },
    );
    doc.text(
      `(${idx + 1})`,
      tableX + cw[0] + cw[1] + cw[2] + cw[3] / 2,
      my + currentHeight / 2 + 1.5,
      { align: "center" },
    );

    my += currentHeight;
  });

  my += 10;
  doc.setFont("times", "bold");
  const docType = item.jenisUjian?.namaJenis?.toLowerCase().includes("proposal")
    ? "Proposal"
    : "Skripsi";
  let statusText = "DITERIMA / DITOLAK";
  if (item.hasil) {
    statusText = item.hasil.toLowerCase() === "lulus" ? "DITERIMA" : "DITOLAK";
  }
  doc.text(
    `MEMUTUSKAN: ${docType} saudara dinyatakan ${statusText} dengan catatan terlampir.`,
    mx,
    my,
  );

  my += 20;
  doc.setFont("times", "normal");
  const rightColX = 140;
  doc.text("Ditetapkan di: Palembang", rightColX, my);
  my += 5;
  const footerDate = item.jadwalUjian
    ? new Date(item.jadwalUjian).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "................................";
  doc.text(`Pada tanggal: ${footerDate}`, rightColX, my);

  my += 15;
  const leftSigX = mx;
  const rightSigX = rightColX;
  doc.text("Ketua Penguji,", leftSigX, my);
  doc.text("Sekretaris Penguji,", rightSigX, my);
  my += 25;
  const ketuaName =
    item.penguji?.find((p) => p.peran === "ketua_penguji")?.nama ||
    "(...................................)";
  const sekName =
    item.penguji?.find((p) => p.peran === "sekretaris_penguji")?.nama ||
    "(...................................)";
  doc.text(ketuaName, leftSigX, my);
  doc.text(sekName, rightSigX, my);
  doc.save(`BA_${item.mahasiswa?.nim || "Ujian"}.pdf`);
};

export const generateDaftarHadirPdf = async (item: BeritaUjian) => {
  const doc = new jsPDF();
  const logoUrl = "/images/uin-raden-fatah.png";
  let logoData = "";
  let dosenList: any[] = [];
  // let userList: any[] = []; // Unused in original code

  try {
    const [logo, dosen] = await Promise.all([
      getBase64ImageFromURL(logoUrl),
      getAllDosen(),
      getAllUsers(), // Was fetched but users unused? Kept for consistency
    ]);
    logoData = logo;
    dosenList = dosen || [];
    // userList = users || [];
  } catch (e) {
    console.error(e);
  }

  const mx = 15,
    contentWidth = 180;
  let my = 15;

  doc.setLineWidth(0.3);
  doc.rect(mx, my, 100, 25);
  if (logoData) doc.addImage(logoData, "PNG", mx + 2, my + 2, 21, 21);
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
  doc.text("FST. FORM SKRIPSI 04", col2X + 40, my + 15, { align: "center" });
  doc.rect(col2X, my + 17, 80, 8);
  doc.setFont("times", "normal");
  doc.text("Tgl. Terbit", col2X + 40, my + 21, { align: "center" });
  doc.text("1 Februari 2018", col2X + 40, my + 24, { align: "center" });

  my += 25;
  doc.rect(mx, my, contentWidth, 8);
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  const formTitleDH = item.jenisUjian?.namaJenis
    ?.toLowerCase()
    .includes("proposal")
    ? "Formulir Daftar Hadir Ujian Seminar Proposal"
    : "Formulir Daftar Hadir Ujian Skripsi";
  doc.text(formTitleDH, mx + 2, my + 5.5);
  my += 15;

  doc.setFont("times", "normal");
  doc.setFontSize(11);
  const startXLabelDH = mx + 2,
    startXColonDH = startXLabelDH + 35,
    startXValueDH = startXColonDH + 5;
  const hariDH = item.hariUjian
    ? item.hariUjian.charAt(0).toUpperCase() + item.hariUjian.slice(1)
    : "...";
  const tanggalDH = item.jadwalUjian
    ? new Date(item.jadwalUjian).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "...";
  const waktuStr =
    item.waktuMulai && item.waktuSelesai
      ? `${item.waktuMulai} - ${item.waktuSelesai} WIB`
      : ".......................... WIB";

  doc.text("Hari/Tanggal", startXLabelDH, my);
  doc.text(":", startXColonDH, my);
  doc.text(`${hariDH}/${tanggalDH}`, startXValueDH, my);
  my += 8;
  doc.text("Waktu", startXLabelDH, my);
  doc.text(":", startXColonDH, my);
  doc.text(waktuStr, startXValueDH, my);
  my += 8;
  doc.text("Nama Mahasiswa", startXLabelDH, my);
  doc.text(":", startXColonDH, my);
  doc.text(item.mahasiswa?.nama || "-", startXValueDH, my);
  my += 8;
  doc.text("NIM", startXLabelDH, my);
  doc.text(":", startXColonDH, my);
  doc.text(item.mahasiswa?.nim || "-", startXValueDH, my);
  my += 8;
  doc.text("Judul Proposal", startXLabelDH, my);
  doc.text(":", startXColonDH, my);
  const splitTitleDH = doc.splitTextToSize(item.judulPenelitian || "-", 120);
  doc.text(splitTitleDH, startXValueDH, my);
  my += splitTitleDH.length * 6 + 5;

  const tableXDH = mx;
  const cwDH = [10, 50, 40, 40, 40];
  const headerHeightDH = 10;

  doc.rect(tableXDH, my, cwDH[0], headerHeightDH);
  doc.rect(tableXDH + cwDH[0], my, cwDH[1], headerHeightDH);
  doc.rect(tableXDH + cwDH[0] + cwDH[1], my, cwDH[2], headerHeightDH);
  doc.rect(tableXDH + cwDH[0] + cwDH[1] + cwDH[2], my, cwDH[3], headerHeightDH);
  doc.rect(
    tableXDH + cwDH[0] + cwDH[1] + cwDH[2] + cwDH[3],
    my,
    cwDH[4],
    headerHeightDH,
  );

  doc.text("No", tableXDH + cwDH[0] / 2, my + 6, { align: "center" });
  doc.text("Nama", tableXDH + cwDH[0] + cwDH[1] / 2, my + 6, {
    align: "center",
  });
  doc.text("NIP/NIDN", tableXDH + cwDH[0] + cwDH[1] + cwDH[2] / 2, my + 6, {
    align: "center",
  });
  doc.text(
    "Jabatan",
    tableXDH + cwDH[0] + cwDH[1] + cwDH[2] + cwDH[3] / 2,
    my + 6,
    { align: "center" },
  );
  doc.text(
    "Tanda",
    tableXDH + cwDH[0] + cwDH[1] + cwDH[2] + cwDH[3] + cwDH[4] / 2,
    my + 4,
    { align: "center" },
  );
  doc.text(
    "Tangan",
    tableXDH + cwDH[0] + cwDH[1] + cwDH[2] + cwDH[3] + cwDH[4] / 2,
    my + 8,
    { align: "center" },
  );
  my += headerHeightDH;

  const pengujiListDH = [
    {
      role: "Ketua Penguji",
      name: item.penguji?.find((p) => p.peran === "ketua_penguji")?.nama || "",
    },
    {
      role: "Sekretaris Penguji",
      name:
        item.penguji?.find((p) => p.peran === "sekretaris_penguji")?.nama || "",
    },
    {
      role: "Penguji I",
      name: item.penguji?.find((p) => p.peran === "penguji_1")?.nama || "",
    },
    {
      role: "Penguji II",
      name: item.penguji?.find((p) => p.peran === "penguji_2")?.nama || "",
    },
  ];

  pengujiListDH.forEach((p, idx) => {
    const displayNo = (idx + 1).toString() + ".";
    const nameLines = doc.splitTextToSize(p.name, cwDH[1] - 4);

    const matchDosen = dosenList.find(
      (d) => d.nama?.toLowerCase() === p.name?.toLowerCase(),
    );
    const nipStr =
      matchDosen?.nidn || matchDosen?.nip || "..........................";

    const nipLines = doc.splitTextToSize(nipStr, cwDH[2] - 4);
    const lineCount = Math.max(nameLines.length, nipLines.length, 1);
    const currentHeight = Math.max(12, 4 + lineCount * 5);

    doc.rect(tableXDH, my, cwDH[0], currentHeight);
    doc.rect(tableXDH + cwDH[0], my, cwDH[1], currentHeight);
    doc.rect(tableXDH + cwDH[0] + cwDH[1], my, cwDH[2], currentHeight);
    doc.rect(
      tableXDH + cwDH[0] + cwDH[1] + cwDH[2],
      my,
      cwDH[3],
      currentHeight,
    );
    doc.rect(
      tableXDH + cwDH[0] + cwDH[1] + cwDH[2] + cwDH[3],
      my,
      cwDH[4],
      currentHeight,
    );

    const midY = my + currentHeight / 2 + 1.5;
    doc.text(displayNo, tableXDH + cwDH[0] / 2, midY, { align: "center" });
    doc.text(
      nameLines,
      tableXDH + 2 + cwDH[0],
      my + (currentHeight - nameLines.length * 5) / 2 + 4,
    );
    doc.text(
      nipLines,
      tableXDH + 2 + cwDH[0] + cwDH[1],
      my + (currentHeight - nipLines.length * 5) / 2 + 4,
    );
    doc.text(
      p.role,
      tableXDH + cwDH[0] + cwDH[1] + cwDH[2] + cwDH[3] / 2,
      midY,
      { align: "center" },
    );

    my += currentHeight;
  });

  my += 15;
  const rightColXDH = 130;
  doc.text("Palembang,", rightColXDH, my);
  my += 5;
  doc.text("Ketua Program Studi,", rightColXDH, my);
  my += 25;

  const targetNipClean = "197508012009122001";
  let kaprodiObj = dosenList.find(
    (d) => d.nip && d.nip.replace(/\s/g, "") === targetNipClean,
  );

  if (!kaprodiObj && item.mahasiswa?.prodi?.namaProdi) {
    const mhsProdi = item.mahasiswa.prodi.namaProdi;
    kaprodiObj = dosenList.find(
      (d) =>
        d.prodi?.nama === mhsProdi &&
        (d.jabatan?.toLowerCase().includes("kaprodi") ||
          d.jabatan?.toLowerCase().includes("ketua program studi")),
    );
  }

  const kaprodiNameDH =
    kaprodiObj?.nama || "(.......................................)";
  const kaprodiNipVal = kaprodiObj?.nip ? `NIP. ${kaprodiObj.nip}` : "NIP.";

  doc.text(kaprodiNameDH, rightColXDH, my);
  my += 5;
  doc.text(kaprodiNipVal, rightColXDH, my);

  doc.save(`Daftar_Hadir_${item.mahasiswa?.nim || "Ujian"}.pdf`);
};

export const generateRekapNilaiPdf = async (ujianList: Ujian[]) => {
  const doc = new jsPDF();
  const logoUrl = "/images/uin-raden-fatah.png";
  let logoData = "";
  let dosenList: any[] = []; // Unused but kept for structure from original??
  // Originally it fetched dosen, so we fetch it too?
  // In original code: const [logo, dosen] = await Promise.all(...)
  // So we should do same.

  try {
    const [logo, dosen] = await Promise.all([
      getBase64ImageFromURL(logoUrl),
      getAllDosen(),
    ]);
    logoData = logo;
    dosenList = dosen || [];
  } catch (e) {
    console.error(e);
  }

  const proposal = ujianList.find((u) =>
    u.jenisUjian?.namaJenis?.toLowerCase().includes("proposal"),
  );
  const hasil = ujianList.find((u) =>
    u.jenisUjian?.namaJenis?.toLowerCase().includes("hasil"),
  );
  const skripsi = ujianList.find((u) =>
    u.jenisUjian?.namaJenis?.toLowerCase().includes("skripsi"),
  );

  const mainRecord = skripsi || hasil || proposal || ujianList[0];
  if (!mainRecord) {
    showToast.error(
      "Anda belum mendaftar ujian apapun. Silakan mendaftar ujian terlebih dahulu.",
    );
    return;
  }

  const mx = 20;
  let my = 15;

  doc.setLineWidth(0.3);
  doc.rect(mx, my, 110, 25);
  if (logoData) {
    doc.addImage(logoData, "PNG", mx + 2, my + 2, 21, 21);
  }
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  const centerText = (text: string, x: number, y: number) => {
    doc.text(text, x, y, { align: "center" });
  };

  const instX = mx + 68;
  centerText("UIN RADEN FATAH PALEMBANG", instX, my + 6);
  centerText("FAKULTAS SAINS DAN TEKNOLOGI", instX, my + 11);
  doc.setFontSize(9);
  centerText("Jl. Prof. K.H. Zainal Abidin Fikry", instX, my + 16);
  centerText("Palembang", instX, my + 21);

  const col2X = mx + 110;
  const rightWidth = 60;
  doc.rect(col2X, my, rightWidth, 8);
  doc.line(col2X + 30, my, col2X + 30, my + 8);

  doc.setFontSize(8);
  centerText("Revisi 01", col2X + 15, my + 5);
  centerText("1 Agustus 2018", col2X + 45, my + 5);

  doc.rect(col2X, my + 8, rightWidth, 8);
  centerText("Kode", col2X + 30, my + 11.5);
  doc.setFont("times", "bold");
  centerText("FST. FORM SKRIPSI 25", col2X + 30, my + 15);

  doc.rect(col2X, my + 16, rightWidth, 9);
  doc.setFont("times", "normal");
  centerText("Tgl. Terbit", col2X + 30, my + 20);
  centerText("1 Pebruari 2018", col2X + 30, my + 23.5);

  my += 25;
  doc.rect(mx, my, 110 + rightWidth, 8);
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  centerText(
    "Formulir Rekapitulasi Nilai Skripsi",
    mx + (110 + rightWidth) / 2,
    my + 5.5,
  );

  my += 15;
  doc.setFont("times", "normal");
  doc.setFontSize(11);

  const startXLabel = mx + 5;
  const startXColon = startXLabel + 30;
  const startXValue = startXColon + 5;

  const hariSkripsi = skripsi?.hariUjian
    ? skripsi.hariUjian.charAt(0).toUpperCase() + skripsi.hariUjian.slice(1)
    : "....................";
  const tglSkripsi = skripsi?.jadwalUjian
    ? new Date(skripsi.jadwalUjian).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ".......................";
  const tglFormatted =
    tglSkripsi === "......................." ? "" : `${tglSkripsi}`;

  doc.text("Hari/Tanggal", startXLabel, my);
  doc.text(":", startXColon, my);
  doc.text(`${hariSkripsi}/${tglFormatted}`, startXValue, my);
  my += 8;

  doc.text("Nama/NIM", startXLabel, my);
  doc.text(":", startXColon, my);
  doc.text(
    `${mainRecord.mahasiswa?.nama || ""}/${mainRecord.mahasiswa?.nim || ""}`,
    startXValue,
    my,
  );
  my += 8;

  doc.text("Judul Skripsi", startXLabel, my);
  doc.text(":", startXColon, my);
  const splitTitle = doc.splitTextToSize(
    mainRecord.judulPenelitian || "-",
    120,
  );
  doc.text(splitTitle, startXValue, my);
  my += splitTitle.length * 6 + 10;

  const tableX = mx;
  const cw = [10, 60, 30, 30, 40];
  const headerH = 8;

  doc.setFont("times", "bold");

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
  centerText(
    "Bobot * Skor",
    tableX + cw[0] + cw[1] + cw[2] + cw[3] + cw[4] / 2,
    my + 5,
  );
  my += headerH;

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
    doc.text("  " + r.name, tableX + cw[0], my + 5.5);
    centerText(`${r.bobot}`, tableX + cw[0] + cw[1] + cw[2] / 2, my + 5.5);
    centerText(
      r.score ? Number(r.score).toFixed(2) : "-",
      tableX + cw[0] + cw[1] + cw[2] + cw[3] / 2,
      my + 5.5,
    );
    centerText(
      r.score ? weightedScore.toFixed(2) : "-",
      tableX + cw[0] + cw[1] + cw[2] + cw[3] + cw[4] / 2,
      my + 5.5,
    );

    my += rowH;
  });

  const colSpanTitle = cw[0] + cw[1] + cw[2] + cw[3];
  doc.rect(tableX, my, colSpanTitle, 8);
  doc.text("Total Angka Nilai", tableX + colSpanTitle - 5, my + 5.5, {
    align: "right",
  });

  doc.rect(tableX + colSpanTitle, my, cw[4], 8);
  centerText(
    totalNilaiAkhir.toFixed(2),
    tableX + colSpanTitle + cw[4] / 2,
    my + 5.5,
  );
  my += 8;

  doc.rect(tableX, my, colSpanTitle, 8);
  doc.text("Nilai Huruf", tableX + colSpanTitle - 5, my + 5.5, {
    align: "right",
  });

  doc.rect(tableX + colSpanTitle, my, cw[4], 8);
  const huruf = getNilaiHuruf(totalNilaiAkhir);
  centerText(huruf, tableX + colSpanTitle + cw[4] / 2, my + 5.5);
  my += 20;

  const noteY = my;

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.text("Catatan interval nilai:", mx, noteY);
  const notes = [
    "A       : 80.00 – 100",
    "B       : 70.00 – 79.99",
    "C       : 60.00 – 69.99",
    "D       : 56.00 -59.99",
    "E       : < 55.99",
  ];
  let ny = noteY + 5;
  notes.forEach((note) => {
    doc.text(note, mx, ny);
    ny += 5;
  });

  const signBlockX = 120;
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  doc.text(`Palembang, ${today}`, signBlockX, noteY);
  ny = noteY + 6;
  doc.text("Mengetahui,", signBlockX, ny);
  ny += 6;
  doc.text("Ketua Program Studi,", signBlockX, ny);
  ny += 30;

  doc.text("Gusmelia Testiana, M.Kom.", signBlockX, ny);
  ny += 6;
  doc.text("NIP. 1234567890", signBlockX, ny);

  doc.save(`Rekap_Nilai_${mainRecord.mahasiswa?.nim || "Ujian"}.pdf`);
};
