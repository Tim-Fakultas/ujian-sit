import React from "react";
import { RancanganPenelitian } from "@/types/RancanganPenelitian";
import { useAuthStore } from "@/stores/useAuthStore";

// interface PDFDocumentProps
interface PDFDocumentProps {
  rancangan: RancanganPenelitian;
  id?: string;
}

export const PDFDocument: React.FC<PDFDocumentProps> = ({
  rancangan,
  id = "pdf-content",
}) => {
  const { user } = useAuthStore();

  return (
    <div
      id={id}
      style={{
        width: "190mm",
        minHeight: "auto",
        padding: "10mm 15mm",
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: "12pt",
        lineHeight: "1.5",
        color: "#000000",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "20mm",
        }}
      >
        <h1
          style={{
            fontSize: "16pt",
            fontWeight: "bold",
            margin: "0 0 3mm 0",
            letterSpacing: "1px",
            textDecoration: "underline",
          }}
        >
          RANCANGAN PENELITIAN
        </h1>

        <div
          style={{
            fontSize: "14pt",
            fontStyle: "italic",
            marginBottom: "4mm",
            fontWeight: "normal",
          }}
        >
          {rancangan.judul_penelitian}
        </div>

        <div
          style={{
            fontSize: "13pt", // Smaller for better fit
            marginBottom: "15mm", // Reduce spacing
            fontWeight: "normal",
          }}
        >
          {user?.nama} ({user?.nim})-
        </div>

      </div>

      {/* Document Content */}
      <div style={{ textAlign: "justify", fontSize: "12pt" }}>
        {/* Section 1 */}
        <div style={{ marginBottom: "10mm" }}>
          <div
            style={{
              fontSize: "12pt", 
              fontWeight: "bold",
              marginBottom: "5mm", 
              textAlign: "left",
            }}
          >
            1.&nbsp;&nbsp;&nbsp;Masalah dan Penyebab
          </div>
          <div
            style={{
              textAlign: "justify",
              lineHeight: "1.5", // Tighter line height
              marginLeft: "10mm", // Less indentation
              marginBottom: "3mm",
            }}
          >
            {rancangan.masalah_dan_penyebab}
          </div>
        </div>

        {/* Section 2 */}
        <div style={{ marginBottom: "10mm" }}>
          <div
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              marginBottom: "5mm",
              textAlign: "left",
            }}
          >
            2.&nbsp;&nbsp;&nbsp;Alternatif Solusi
          </div>
          <div
            style={{
              textAlign: "justify",
              lineHeight: "1.5",
              marginLeft: "10mm",
              marginBottom: "3mm",
            }}
          >
            {rancangan.alternatif_solusi}
          </div>
        </div>

        {/* Section 3 */}
        <div style={{ marginBottom: "10mm" }}>
          <div
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              marginBottom: "5mm",
              textAlign: "left",
            }}
          >
            3.&nbsp;&nbsp;&nbsp;Hasil yang diharapkan
          </div>
          <div
            style={{
              textAlign: "justify",
              lineHeight: "1.5",
              marginLeft: "10mm",
              marginBottom: "3mm",
            }}
          >
            {rancangan.hasil_yang_diharapkan}
          </div>
        </div>

        {/* Section 4 */}
        <div style={{ marginBottom: "10mm" }}>
          <div
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              marginBottom: "5mm",
              textAlign: "left",
            }}
          >
            4.&nbsp;&nbsp;&nbsp;Kebutuhan Data
          </div>
          <div
            style={{
              textAlign: "justify",
              lineHeight: "1.5",
              marginLeft: "10mm",
              marginBottom: "3mm",
            }}
          >
            {rancangan.kebutuhan_data}
          </div>
        </div>

        {/* Section 5 */}
        <div style={{ marginBottom: "20mm" }}>
          <div
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              marginBottom: "5mm",
              textAlign: "left",
            }}
          >
            5.&nbsp;&nbsp;&nbsp;Metode Pelaksanaan
          </div>
          <div
            style={{
              textAlign: "justify",
              lineHeight: "1.5",
              marginLeft: "10mm",
              marginBottom: "3mm",
            }}
          >
            {rancangan.metode_penelitian}
          </div>
        </div>

        {/* Signature Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "25mm",
          }}
        >
          <div style={{ width: "45%", textAlign: "center" }}>
            <div
              style={{
                marginBottom: "20mm",
                fontSize: "12pt",
                textAlign: "left",
              }}
            >
              Palembang, _____________
            </div>
            <div
              style={{
                marginBottom: "4mm",
                fontSize: "12pt",
                textAlign: "left",
              }}
            >
              Menyetujui:
            </div>
            <div
              style={{
                marginBottom: "20mm",
                fontSize: "12pt",
                textAlign: "left",
              }}
            >
              Dosen PA,
            </div>

            <div style={{ height: "25mm", marginBottom: "4mm" }}></div>
            <div
              style={{
                fontSize: "12pt",
                fontWeight: "normal",
                textAlign: "left",
              }}
            >
              {user?.dosenPA?.nama}
            </div>
            <div style={{ fontSize: "12pt", textAlign: "left" }}>
              NIP. {user?.dosenPA?.id}
            </div>
          </div>

          <div style={{ width: "45%", textAlign: "left", marginLeft: "30mm" }}>
            <div style={{ marginBottom: "29mm" }}>&nbsp;</div>
            <div style={{ marginBottom: "4mm", fontSize: "12pt" }}>Penulis</div>
            <div style={{ marginBottom: "11mm" }}>&nbsp;</div>

            <div style={{ height: "25mm", marginBottom: "4mm" }}></div>
            <div style={{ fontSize: "12pt", fontWeight: "normal" }}>
              {user?.nama}
            </div>
            <div style={{ fontSize: "12pt", textAlign: "left" }}>
              NIM. {user?.nim}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
