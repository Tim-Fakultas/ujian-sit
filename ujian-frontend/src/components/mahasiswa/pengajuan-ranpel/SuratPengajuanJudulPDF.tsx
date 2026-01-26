import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";

interface SuratPengajuanJudulPDFProps {
    pengajuan: PengajuanRanpel;
    kaprodi?: { nama: string; nip: string };
    pembimbingDetails?: {
        p1?: { nip?: string; nidn?: string };
        p2?: { nip?: string; nidn?: string };
    };
}

const styles = StyleSheet.create({
    page: {
        paddingTop: "15mm",
        paddingRight: "15mm",
        paddingBottom: "15mm",
        paddingLeft: "25mm",
        fontFamily: "Times-Roman",
        fontSize: 11,
        lineHeight: 1.3,
    },
    // Header Table
    table: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#000",
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },
    // Column Widths for Header
    col1: { width: "15%", borderRightWidth: 1, borderRightColor: "#000", padding: 2, justifyContent: "center", alignItems: "center" },
    col2: { width: "50%", borderRightWidth: 1, borderRightColor: "#000", padding: 2, justifyContent: "center", alignItems: "center" },
    col3: { width: "35%", padding: 0 },

    // Sub-rows in Col 3 (Info)
    subRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        height: 18,
        alignItems: "center"
    },
    subRowLast: {
        height: 32,
        justifyContent: "center",
        alignItems: "center"
    },

    // Text Styles
    headerText: { fontSize: 10, textAlign: "center", fontFamily: "Times-Bold" },
    headerSubText: { fontSize: 9, textAlign: "center" },
    smallText: { fontSize: 9 },

    // Title Row
    titleRow: {
        flexDirection: "row",
    },
    titleColLeft: {
        width: "65%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    titleColRight: {
        width: "35%",
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
    },

    // Content
    dateSection: {
        textAlign: "right",
        marginTop: 5,
        marginBottom: 10,
        fontSize: 11,
    },
    perihalTable: {
        marginBottom: 10,
    },
    perihalRow: {
        flexDirection: "row",
    },
    fieldLabel: { width: 60, fontSize: 11 },
    fieldColon: { width: 10, fontSize: 11 },
    fieldValue: { flex: 1, fontSize: 11 },

    addressBlock: {
        marginBottom: 10,
        fontSize: 11,
    },
    greeting: {
        marginBottom: 8,
        fontStyle: "italic",
        fontSize: 11,
    },
    intro: {
        textAlign: "justify",
        marginBottom: 8,
        fontSize: 11,
    },
    biodataTable: {
        marginBottom: 8,
    },
    biodataRow: { flexDirection: "row", marginBottom: 2 },
    bioLabel: { width: 100, fontSize: 11 },
    bioColon: { width: 10, fontSize: 11 },
    bioValue: { flex: 1, fontSize: 11 },

    bodyText: {
        textAlign: "justify",
        marginBottom: 8,
        fontSize: 11,
    },

    // Titles
    titlesContainer: {
        marginLeft: 15,
        marginBottom: 10,
    },
    titleItem: {
        flexDirection: "row",
        marginBottom: 4,
        alignItems: "flex-end",
    },
    titleNumber: { width: 20, fontSize: 11 },
    titleContent: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        borderBottomStyle: "dotted",
        paddingBottom: 1,
    },

    closing: {
        marginBottom: 10,
        fontSize: 11,
    },

    // Signatures
    signatureSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
        marginBottom: 8,
    },
    sigBoxLeft: { width: "40%" },
    sigBoxRight: { width: "40%", paddingLeft: 30 },
    sigSpace: { height: 40 },
    sigLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        borderBottomStyle: "dotted",
        textAlign: "left",
        marginTop: 2
    },

    // Pembimbing
    advisorSection: {
        marginTop: 0,
        marginBottom: 8,
    },
    advisorRow: {
        flexDirection: "row",
        marginBottom: 4,
        alignItems: "flex-end",
    },
    advisorLabel: { width: 100, fontSize: 11 },
    advisorName: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        borderBottomStyle: "dotted",
        paddingBottom: 1,
    },
    advisorSign: { width: 140, marginLeft: 10, textAlign: "right", fontSize: 10 },

    // Notes
    notesSection: {
        marginTop: 10,
        fontSize: 9,
    },
    noteItem: {
        flexDirection: "row",
        marginBottom: 1,
        marginLeft: 10,
    },
});

const SuratPengajuanJudulPDF: React.FC<SuratPengajuanJudulPDFProps> = ({ pengajuan, kaprodi, pembimbingDetails }) => {
    const { ranpel, mahasiswa } = pengajuan;
    const prodiName = mahasiswa.prodi?.nama || "Sistem Informasi";
    const fakultasName = "Sains dan Teknologi";

    // Format Date for display
    const formattedDate = pengajuan.tanggalPengajuan
        ? new Date(pengajuan.tanggalPengajuan).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : "....................................................";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header Table */}
                <View style={styles.table}>
                    <View style={styles.row}>
                        {/* Logo */}
                        <View style={styles.col1}>
                            <Image
                                src="/images/uin-raden-fatah.png"
                                style={{ width: 60, height: 60, objectFit: 'contain' }}
                            />
                        </View>
                        {/* Institute Info */}
                        <View style={styles.col2}>
                            <Text style={styles.headerText}>UIN RADEN FATAH PALEMBANG</Text>
                            <Text style={styles.headerText}>FAKULTAS SAINS DAN TEKNOLOGI</Text>
                            <Text style={styles.headerSubText}>Jl. Prof. K.H. Zainal Abidin Fikry Palembang</Text>
                        </View>
                        {/* Form Info */}
                        <View style={styles.col3}>
                            <View style={styles.subRow}>
                                <View style={{ width: "50%", borderRightWidth: 1, height: "100%", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={styles.smallText}>Revisi 01</Text>
                                </View>
                                <View style={{ width: "50%", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={styles.smallText}>1 Agustus 2018</Text>
                                </View>
                            </View>
                            <View style={styles.subRowLast}>
                                <Text style={styles.smallText}>Kode</Text>
                                <Text style={{ fontFamily: "Times-Bold", fontSize: 11 }}>FST. FORM SKRIPSI 01</Text>
                            </View>
                        </View>
                    </View>

                    {/* Title Row */}
                    <View style={styles.titleRow}>
                        <View style={styles.titleColLeft}>
                            <Text style={styles.headerSubText}>Formulir</Text>
                            <Text style={{ fontSize: 14, fontFamily: "Times-Bold", textTransform: "uppercase", textAlign: "center" }}>
                                Pengajuan Judul dan Pembimbing Skripsi
                            </Text>
                        </View>
                        <View style={styles.titleColRight}>
                            <Text style={styles.smallText}>Tgl. Terbit</Text>
                            <Text style={{ fontSize: 11 }}>1 Pebruari 2018</Text>
                        </View>
                    </View>
                </View>

                {/* Content Body */}
                <View>
                    <Text style={styles.dateSection}>Palembang, {formattedDate}</Text>

                    <View style={styles.perihalTable}>
                        <View style={styles.perihalRow}>
                            <Text style={styles.fieldLabel}>Perihal</Text>
                            <Text style={styles.fieldColon}>:</Text>
                            <Text style={styles.fieldValue}>Permohonan Judul & Pembimbing Skripsi</Text>
                        </View>
                    </View>

                    <View style={styles.addressBlock}>
                        <Text>Kepada Yth.</Text>
                        <Text>Ketua Program Studi {prodiName}</Text>
                        <Text>Fakultas {fakultasName}</Text>
                        <Text>Universitas Islam Negeri Raden Fatah</Text>
                        <Text>Palembang</Text>
                    </View>

                    <Text style={styles.greeting}>Assalamu &apos;alaikum Warohmatullahi Wabarokatuh.</Text>

                    <Text style={styles.intro}>
                        Saya yang bertanda tangan dibawah ini, mahasiswa Program Studi {prodiName} Fakultas {fakultasName} Universitas Islam Negeri Raden Fatah Palembang.
                    </Text>

                    <View style={styles.biodataTable}>
                        <View style={styles.biodataRow}>
                            <Text style={styles.bioLabel}>Nama</Text>
                            <Text style={styles.bioColon}>:</Text>
                            <Text style={styles.bioValue}>{mahasiswa.nama || "...................................................."}</Text>
                        </View>
                        <View style={styles.biodataRow}>
                            <Text style={styles.bioLabel}>NIM</Text>
                            <Text style={styles.bioColon}>:</Text>
                            <Text style={styles.bioValue}>{mahasiswa.nim || "...................................................."}</Text>
                        </View>
                        <View style={styles.biodataRow}>
                            <Text style={styles.bioLabel}>Semester</Text>
                            <Text style={styles.bioColon}>:</Text>
                            <Text style={styles.bioValue}>{mahasiswa.semester || "...................................................."}</Text>
                        </View>
                    </View>

                    <Text style={styles.bodyText}>
                        Sehubungan dengan akan berakhirnya studi saya, maka dengan ini mengajukan permohonan judul dan pembimbing Skripsi. Adapun judul yang saya ajukan sebagai berikut:
                    </Text>

                    <View style={styles.titlesContainer}>
                        <View style={styles.titleItem}>
                            <Text style={styles.titleNumber}>1.</Text>
                            <View style={styles.titleContent}>
                                <Text>{pengajuan.perbaikanJudul?.judulBaru || ranpel.judulPenelitian}</Text>
                            </View>
                        </View>
                        <View style={styles.titleItem}>
                            <Text style={styles.titleNumber}>2.</Text>
                            <View style={styles.titleContent}>
                                <Text> </Text>
                            </View>
                        </View>
                        <View style={styles.titleItem}>
                            <Text style={styles.titleNumber}>3.</Text>
                            <View style={styles.titleContent}>
                                <Text> </Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.closing}>Atas perhatiannya, saya ucapkan terima kasih.</Text>
                    <Text style={styles.greeting}>Wassalamu &apos;alaikum Warohmatullahi Wabarokatuh.</Text>

                    {/* Signature 1: Advisors (Top) */}
                    <View style={styles.advisorSection}>
                        <View style={styles.advisorRow}>
                            <Text style={styles.advisorLabel}>Pembimbing I</Text>
                            <Text style={styles.bioColon}>:</Text>
                            <View style={styles.advisorName}>
                                <Text>{mahasiswa.pembimbing1?.nama}</Text>
                            </View>
                            <Text style={styles.advisorSign}>
                                ({pembimbingDetails?.p1?.nip ? `${pembimbingDetails.p1.nip}` : (pembimbingDetails?.p1?.nidn ? `NIDN. ${pembimbingDetails.p1.nidn}` : "..................................")})
                            </Text>
                        </View>
                        <View style={styles.advisorRow}>
                            <Text style={styles.advisorLabel}>Pembimbing II</Text>
                            <Text style={styles.bioColon}>:</Text>
                            <View style={styles.advisorName}>
                                <Text>{mahasiswa.pembimbing2?.nama}</Text>
                            </View>
                            <Text style={styles.advisorSign}>
                                ({pembimbingDetails?.p2?.nip ? `${pembimbingDetails.p2.nip}` : (pembimbingDetails?.p2?.nidn ? `${pembimbingDetails.p2.nidn}` : "..................................")})
                            </Text>
                        </View>
                    </View>

                    {/* Signature 2: Kaprodi (Left) & Mahasiswa (Right) */}
                    <View style={styles.signatureSection}>
                        {/* Kaprodi */}
                        <View style={styles.sigBoxLeft}>
                            <Text>Mengetahui,</Text>
                            <Text>Ketua Program Studi</Text>
                            <View style={styles.sigSpace} />
                            <Text style={{ ...styles.sigLine, borderBottomStyle: "solid" }}>
                                {kaprodi?.nama || "........................................................"}
                            </Text>
                            <Text style={{ marginTop: 2 }}>
                                NIP. {kaprodi?.nip || "........................................................"}
                            </Text>
                        </View>

                        {/* Mahasiswa */}
                        <View style={styles.sigBoxRight}>
                            <Text>Hormat saya,</Text>
                            <Text> </Text>
                            <View style={styles.sigSpace} />
                            <Text style={{ ...styles.sigLine, borderBottomStyle: "solid" }}>{mahasiswa.nama}</Text>
                        </View>
                    </View>

                    {/* Footer Notes */}
                    <View style={styles.notesSection}>
                        <Text style={{ marginBottom: 5 }}>*) Catatan lampiran pengajuan:</Text>
                        {[
                            "Formulir di isi lengkap (Pembimbing diisi KaProdi dan ditanda tangani pembimbing yang bersangkutan setelah di ACC KaProdi)",
                            "Rancangan penelitian beserta kelengkapannya",
                            "Photocopy KTM",
                            "Photocopy kwitansi pembayaran SPP semester berjalan",
                            "Photocopy KST yang tercantum Skripsi",
                            "Photocopy Transkrip Nilai",
                            "Seluruh berkas dimasukkan dalam map plastik transparan warna biru"
                        ].map((note, i) => (
                            <View key={i} style={styles.noteItem}>
                                <Text style={{ width: 10 }}>-</Text>
                                <Text style={{ flex: 1, textAlign: "justify" }}>{note}</Text>
                            </View>
                        ))}
                    </View>

                </View>
            </Page>
        </Document>
    );
};

export default SuratPengajuanJudulPDF;
