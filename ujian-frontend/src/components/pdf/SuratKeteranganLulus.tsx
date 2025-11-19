/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// --- Gaya dasar PDF ---
const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 50,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
    backgroundColor: "#fff",
  },
  content: {
    width: "100%",
    flexDirection: "column",
  },

  // Header grid 2 kolom
  headerTable: {
    flexDirection: "row",
    border: "1px solid #222",
    borderRadius: 6,
    width: "100%",
    marginBottom: 12,
    backgroundColor: "#f7f7f7",
  },
  headerLeft: {
    width: "60%",
    padding: 10,
    borderRight: "1px solid #222",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 70, height: 70, marginBottom: 4 },
  headerText: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 1.2,
    marginTop: 2,
  },

  headerRight: {
    width: "40%",
    padding: 8,
    fontSize: 9,
    justifyContent: "center",
  },
  headerRightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid #222",
    paddingVertical: 2,
    marginBottom: 2,
  },
  headerRightCell: {
    flex: 1,
    textAlign: "center",
  },

  // Judul tengah
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
    padding: 8,
    marginBottom: 10,
    textDecoration: "underline",
    color: "#222",
    letterSpacing: 1,
  },

  section: {
    marginTop: 10,
    marginBottom: 10,
  },

  infoBox: {
    border: "1px solid #ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "flex-start",
  },
  label: {
    width: "32%",
    fontWeight: "bold",
    color: "#222",
  },
  colon: { width: "3%" },
  value: { width: "65%" },
  underline: { textDecoration: "underline" },

  pengujiBox: {
    border: "1px solid #eee",
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
  },

  boldCenter: {
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 10,
    fontSize: 14,
    color: "#222",
  },
  nilaiBox: {
    textAlign: "center",
    marginVertical: 12,
    padding: 10,
    border: "1px solid #222",
    borderRadius: 6,
    backgroundColor: "#f3f3f3",
  },
  nilaiAngka: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a7f37",
    letterSpacing: 2,
  },
  nilaiHuruf: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a7f37",
    textDecoration: "underline",
    marginLeft: 6,
  },

  footer: {
    marginTop: 50,
    width: "100%",
    alignItems: "flex-end",
  },
  footerText: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  footerBold: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 8,
  },
});

interface Props {
  nama: string;
  nim: string;
  judul: string;
  nilaiHuruf: string;
  total: number;
  waktuMulai?: string;
  waktuSelesai?: string;
  dosenPembimbing1?: string;
  dosenPembimbing2?: string;
  ketuaPenguji?: string;
  sekretarisPenguji?: string;
  penguji1?: string;
  penguji2?: string;
}

export const SuratKeteranganLulusPDF = ({
  nama,
  nim,
  judul,
  nilaiHuruf,
  total,
  waktuMulai = "-",
  waktuSelesai = "-",
  dosenPembimbing1 = "-",
  dosenPembimbing2 = "-",
  ketuaPenguji = "-",
  sekretarisPenguji = "-",
  penguji1 = "-",
  penguji2 = "-",
}: Props) => {
  const tanggal = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerTable}>
          {/* LEFT SIDE */}
          <View style={styles.headerLeft}>
            <Image src="/images/uin-raden-fatah.webp" />
            <Text
              style={{ fontSize: 12, fontWeight: "bold", color: "#1a7f37" }}
            >
              UIN RADEN FATAH PALEMBANG
            </Text>
            <Text style={styles.headerText}>
              FAKULTAS SAINS DAN TEKNOLOGI{"\n"}
              Jl. Prof. K.H. Zainal Abidin Fikry Palembang
            </Text>
          </View>
          {/* RIGHT SIDE */}
          <View style={styles.headerRight}>
            <View style={styles.headerRightRow}>
              <Text style={styles.headerRightCell}>Revisi 01</Text>
              <Text style={styles.headerRightCell}>1 Agustus 2018</Text>
            </View>
            <View style={styles.headerRightRow}>
              <Text style={styles.headerRightCell}>Kode</Text>
              <Text style={styles.headerRightCell}>FST. FORM SKRIPSI 31</Text>
            </View>
            <View style={[styles.headerRightRow, { borderBottom: "none" }]}>
              <Text style={styles.headerRightCell}>Tgl. Terbit</Text>
              <Text style={[styles.headerRightCell, { color: "#c00" }]}>
                1 Februari 2018
              </Text>
            </View>
          </View>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>Surat Keterangan Lulus Ujian Skripsi</Text>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.section}>
            Pada hari ini, tanggal
            <Text style={styles.underline}>{tanggal}</Text>, telah berlangsung
            ujian skripsi mahasiswa:
          </Text>

          <View style={styles.infoBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Nama</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{nama}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>NIM</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{nim}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Program Studi</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>SISTEM INFORMASI</Text>
            </View>
            <View style={[styles.row, { marginBottom: 8 }]}>
              <Text style={styles.label}>Judul Skripsi</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{judul}</Text>
            </View>
          </View>

          <Text style={styles.section}>
            Ujian berlangsung dari pukul{" "}
            <Text style={styles.underline}>{waktuMulai}</Text> WIB, sampai
            dengan <Text style={styles.underline}>{waktuSelesai}</Text> WIB
          </Text>

          <View style={styles.pengujiBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Dosen Pembimbing I</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{dosenPembimbing1}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Dosen Pembimbing II</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{dosenPembimbing2}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Ketua Penguji</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{ketuaPenguji}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Sekretaris Penguji</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{sekretarisPenguji}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Penguji I</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{penguji1}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Penguji II</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{penguji2}</Text>
            </View>
          </View>

          <Text style={styles.section}>
            Dari hasil Ujian Skripsi tersebut memutuskan bahwa yang bersangkutan
            dinyatakan:
          </Text>

          <View style={styles.nilaiBox}>
            <Text style={styles.boldCenter}>LULUS dengan nilai:</Text>
            <Text style={styles.nilaiAngka}>
              {total?.toFixed(2) ?? "..............."}{" "}
              <Text style={styles.nilaiHuruf}>({nilaiHuruf})</Text>
            </Text>
          </View>

          <Text style={{ textAlign: "center", marginBottom: 10 }}>
            Demikian Surat Keterangan ini dibuat sebagai bukti dari hasil Ujian
            Skripsi.
          </Text>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Palembang, ........................................
            </Text>
            <Text style={styles.footerText}>Mengetahui,</Text>
            <Text style={styles.footerBold}>Ketua Program Studi,</Text>
            <Text style={[styles.footerText, { marginTop: 40 }]}>
              _________________________
            </Text>
            <Text style={styles.footerText}>NIP.</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
