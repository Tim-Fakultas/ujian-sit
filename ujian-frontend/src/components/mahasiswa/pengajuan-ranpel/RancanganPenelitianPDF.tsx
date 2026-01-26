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

interface RancanganPenelitianPDFProps {
    pengajuan: PengajuanRanpel;
}

const styles = StyleSheet.create({
    page: {
        paddingTop: "20mm",
        paddingRight: "20mm",
        paddingBottom: "20mm",
        paddingLeft: "30mm",
        fontFamily: "Times-Roman",
        fontSize: 12,
        lineHeight: 1.5,
    },
    // Header
    headerTitle: {
        fontSize: 14,
        fontFamily: "Times-Bold",
        textAlign: "center",
        textTransform: "uppercase",
        marginBottom: 2,
    },
    headerLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        marginBottom: 10,
        marginHorizontal: 40, // Adjust to match the width of the title roughly if needed, or full width
    },
    subHeader: {
        textAlign: "center",
        marginBottom: 20,
    },
    judulText: {
        fontFamily: "Times-Italic",
        marginBottom: 5,
        fontSize: 12,
    },
    namaText: {
        fontFamily: "Times-Roman",
        fontSize: 12,
    },

    // Content
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontFamily: "Times-Bold",
        marginBottom: 5,
        flexDirection: "row",
    },
    sectionNumber: {
        width: 20,
    },
    sectionLabel: {
        flex: 1,
    },
    sectionContent: {
        textAlign: "justify",
        marginLeft: 20, // Indent content
    },

    // Signatures
    signatureContainer: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sigBoxLeft: {
        width: "40%",
    },
    sigBoxRight: {
        width: "40%",
    },
    sigSpace: {
        height: 50,
    },
    sigName: {
        fontFamily: "Times-Roman",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        // borderBottomStyle: "dotted", // Or solid
    },

    // Footer / Lampiran
    lampiranSection: {
        marginTop: 20,
    },
    refSection: {
        marginTop: 10,
        marginLeft: 20,
    }

});

const RancanganPenelitianPDF: React.FC<RancanganPenelitianPDFProps> = ({ pengajuan }) => {
    const { ranpel, mahasiswa } = pengajuan;
    const formattedDate = pengajuan.tanggalPengajuan
        ? new Date(pengajuan.tanggalPengajuan).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : ".............................";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View>
                    <Text style={styles.headerTitle}>RANCANGAN PENELITIAN</Text>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: "#000", marginHorizontal: 20, marginBottom: 10 }} />
                </View>

                <View style={styles.subHeader}>
                    <Text style={styles.judulText}>{pengajuan.perbaikanJudul?.judulBaru || ranpel.judulPenelitian || "Judul Penelitian"}</Text>
                    <Text style={styles.namaText}>{mahasiswa.nama} ({mahasiswa.nim})</Text>
                </View>

                {/* Content Sections */}
                {/* 1. Masalah dan Penyebab */}
                <View style={styles.section}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.sectionNumber}>1.</Text>
                        <Text style={styles.sectionLabel}>Masalah dan Penyebab</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        {ranpel.masalahDanPenyebab || "-"}
                    </Text>
                </View>

                {/* 2. Alternatif Solusi */}
                <View style={styles.section}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.sectionNumber}>2.</Text>
                        <Text style={styles.sectionLabel}>Alternatif Solusi</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        {ranpel.alternatifSolusi || "-"}
                    </Text>
                </View>

                {/* 3. Hasil yang diharapkan */}
                <View style={styles.section}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.sectionNumber}>3.</Text>
                        <Text style={styles.sectionLabel}>Hasil yang diharapkan</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        {ranpel.hasilYangDiharapkan || "-"}
                    </Text>
                </View>

                {/* 4. Kebutuhan Data */}
                <View style={styles.section}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.sectionNumber}>4.</Text>
                        <Text style={styles.sectionLabel}>Kebutuhan Data</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        {ranpel.kebutuhanData || "-"}
                    </Text>
                </View>

                {/* 5. Metode Pelaksanaan */}
                <View style={styles.section}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.sectionNumber}>5.</Text>
                        <Text style={styles.sectionLabel}>Metode Pelaksanaan</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        {ranpel.metodePenelitian || "-"}
                    </Text>
                </View>

                {/* Signatures */}
                <View style={styles.signatureContainer}>
                    <View style={styles.sigBoxLeft}>
                        <Text>Menyetujui:</Text>
                        <Text>Dosen PA,</Text>
                        <View style={styles.sigSpace} />
                        <Text style={styles.namaText}>{mahasiswa.dosenPa?.nama || "Nama Dosen PA"}</Text>
                        <Text>NIP. {mahasiswa.dosenPa?.nip || ".............................."}</Text>
                    </View>

                    <View style={styles.sigBoxRight}>
                        <Text style={{ textAlign: "left", marginBottom: 5 }}>Palembang, {formattedDate}</Text>
                        <Text>Penulis</Text>
                        <View style={styles.sigSpace} />
                        <Text style={styles.namaText}>{mahasiswa.nama}</Text>
                        <Text>NIM. {mahasiswa.nim}</Text>
                    </View>
                </View>

                {/* Lampiran */}
                <View style={styles.lampiranSection}>
                    <Text>Lampiran:</Text>
                    <Text style={{ fontStyle: "italic", fontSize: 10, marginTop: 5 }}>*Bentuk sesuai dengan tinjauan pustaka</Text>

                    <Text style={{ fontWeight: "bold", marginTop: 10 }}>Jurnal Referensi:</Text>
                    <View style={styles.refSection}>
                        {/* Split references by new line if possible, or just dump string */}
                        <Text style={{ textAlign: "justify" }}>{ranpel.jurnalReferensi || "-"}</Text>
                    </View>
                </View>

            </Page>
        </Document>
    );
};

export default RancanganPenelitianPDF;
