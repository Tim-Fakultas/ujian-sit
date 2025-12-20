import React, { forwardRef } from "react";
import Image from "next/image";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";

interface SuratPengajuanJudulProps {
  pengajuan: PengajuanRanpel;
}

const SuratPengajuanJudul = forwardRef<
  HTMLDivElement,
  SuratPengajuanJudulProps
>(({ pengajuan }, ref) => {
  const mhs = pengajuan.mahasiswa;
  // Fallback data if needed
  const prodiName = mhs.prodi?.nama || "Sistem Informasi";
  const fakultasName = "SAINS DAN TEKNOLOGI";

  const placeholderLine = (minWidth: number = 200) => (
    <span
      style={{
        display: "inline-block",
        minWidth: minWidth,
        borderBottom: "1px dotted #000",
        height: "1em",
      }}
    >
      &nbsp;
    </span>
  );

  return (
    <div
      ref={ref}
      style={{
        width: "210mm", // A4 width
        minHeight: "297mm", // A4 height
        padding: "20mm 20mm 20mm 30mm", // Margin: Top, Right, Bottom, Left (approx standard)
        background: "white",
        color: "black",
        fontFamily: "'Calibri', 'Carlito', sans-serif", // Use Calibri as requested
        fontSize: "11pt",
        lineHeight: 1.3,
        boxSizing: "border-box",
      }}
    >
      {/* 1. HEADER TABLE */}
      <table
        className="header-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "2px solid black",
          marginBottom: "5mm",
        }}
      >
        <tbody>
          <tr>
            {/* Logo Column */}
            <td
              rowSpan={2}
              style={{
                width: "15%",
                border: "1px solid black",
                textAlign: "center",
                verticalAlign: "middle",
                padding: "5px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "80px",
                  height: "80px",
                  margin: "0 auto",
                }}
              >
                <Image
                  src="/images/logo-uin.png"
                  alt="Logo UIN"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </td>

            {/* Institution Info Column */}
            <td
              rowSpan={2}
              style={{
                width: "50%",
                border: "1px solid black",
                textAlign: "center",
                verticalAlign: "middle",
                padding: "5px",
              }}
            >
              <div style={{ fontSize: "12pt", fontWeight: "bold" }}>
                UIN RADEN FATAH PALEMBANG
              </div>
              <div style={{ fontSize: "12pt", fontWeight: "bold" }}>
                FAKULTAS {fakultasName}
              </div>
              <div style={{ fontSize: "10pt" }}>
                Jl. Prof. K.H. Zainal Abidin Fikry Palembang
              </div>
            </td>

            {/* Revision / Date Info Column */}
            <td
              style={{
                width: "35%",
                border: "1px solid black",
                padding: 0,
                verticalAlign: "top",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  height: "100%",
                }}
              >
                <tbody>
                  <tr style={{ height: "50%" }}>
                    <td
                      style={{
                        borderRight: "1px solid black",
                        borderBottom: "1px solid black",
                        padding: "2px 5px",
                        width: "50%",
                        textAlign: "center",
                        fontSize: "10pt",
                      }}
                    >
                      Revisi 01
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        padding: "2px 5px",
                        width: "50%",
                        textAlign: "center",
                        fontSize: "10pt",
                      }}
                    >
                      1 Agustus 2018
                    </td>
                  </tr>
                  <tr style={{ height: "50%" }}>
                    <td
                      colSpan={2}
                      style={{
                        padding: "5px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <div style={{ fontSize: "10pt" }}>Kode</div>
                      <div style={{ fontWeight: "bold", fontSize: "11pt" }}>
                        FST. FORM SKRIPSI 01
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
        {/* Bottom Row of Header */}
        <tbody>
          <tr>
            <td
              colSpan={2}
              style={{
                border: "1px solid black",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "10pt", marginBottom: "2px" }}>
                Formulir
              </div>
              <div style={{ fontSize: "14pt", fontWeight: "bold" }}>
                Pengajuan Judul dan Pembimbing Skripsi
              </div>
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "5px",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <div style={{ fontSize: "10pt" }}>Tgl. Terbit</div>
              <div style={{ fontSize: "11pt" }}>1 Pebruari 2018</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 2. BODY OF LETTER */}
      <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
        {/* Date */}
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          Palembang, ....................................................
        </div>

        {/* Perihal Section */}
        <div style={{ marginBottom: "20px" }}>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ width: "60px", verticalAlign: "top" }}>Perihal</td>
                <td style={{ width: "10px", verticalAlign: "top" }}>:</td>
                <td>Permohonan Judul & Pembimbing Skripsi</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Addressee */}
        <div style={{ marginBottom: "20px" }}>
          <div>Kepada Yth.</div>
          <div>Ketua Program Studi {prodiName}</div>
          <div>Fakultas {fakultasName}</div>
          <div>Universitas Islam Negeri Raden Fatah</div>
          <div>Palembang</div>
        </div>

        {/* Opening */}
        <div style={{ marginBottom: "15px", fontStyle: "italic" }}>
          Assalamu &apos;alaikum Warohmatullahi Wabarokatuh.
        </div>

        <div style={{ marginBottom: "15px", textAlign: "justify" }}>
          Saya yang bertanda tangan dibawah ini, mahasiswa Program Studi{" "}
          {prodiName} Fakultas {fakultasName} Universitas Islam Negeri Raden
          Fatah Palembang.
        </div>

        {/* Student Data */}
        <table
          style={{ marginLeft: "0px", marginBottom: "15px", width: "100%" }}
        >
          <tbody>
            <tr>
              <td style={{ width: "100px", paddingBottom: "5px" }}>Nama</td>
              <td style={{ width: "10px", paddingBottom: "5px" }}>:</td>
              <td style={{ paddingBottom: "5px" }}>
                {mhs.nama ||
                  "................................................................"}
              </td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px" }}>NIM</td>
              <td style={{ paddingBottom: "5px" }}>:</td>
              <td style={{ paddingBottom: "5px" }}>
                {mhs.nim ||
                  "................................................................"}
              </td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px" }}>Semester</td>
              <td style={{ paddingBottom: "5px" }}>:</td>
              <td style={{ paddingBottom: "5px" }}>
                {mhs.semester ||
                  "................................................................"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Body Text */}
        <div style={{ marginBottom: "10px", textAlign: "justify" }}>
          Sehubungan dengan akan berakhirnya studi saya, maka dengan ini
          mengajukan permohonan judul dan pembimbing Skripsi. Adapun judul yang
          saya ajukan sebagai berikut:
        </div>

        {/* Titles List */}
        <div style={{ marginBottom: "20px", paddingLeft: "20px" }}>
          <div
            style={{
              display: "flex",
              marginBottom: "10px",
              alignItems: "flex-end",
            }}
          >
            <span style={{ marginRight: "10px", paddingBottom: "5px" }}>
              1.
            </span>
            <div
              style={{
                borderBottom: "1px dotted black",
                flexGrow: 1,
                minHeight: "20px",
                paddingBottom: "5px",
                lineHeight: "1.5",
              }}
            >
              {pengajuan.ranpel.judulPenelitian}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginBottom: "10px",
              alignItems: "flex-end",
            }}
          >
            <span style={{ marginRight: "10px", paddingBottom: "5px" }}>
              2.
            </span>
            <div
              style={{
                borderBottom: "1px dotted black",
                flexGrow: 1,
                minHeight: "20px",
                paddingBottom: "5px",
              }}
            >
              &nbsp;
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginBottom: "10px",
              alignItems: "flex-end",
            }}
          >
            <span style={{ marginRight: "10px", paddingBottom: "5px" }}>
              3.
            </span>
            <div
              style={{
                borderBottom: "1px dotted black",
                flexGrow: 1,
                minHeight: "20px",
                paddingBottom: "5px",
              }}
            >
              &nbsp;
            </div>
          </div>
        </div>

        {/* Closing */}
        <div style={{ marginBottom: "10px" }}>
          Atas perhatiannya, saya ucapkan terima kasih.
        </div>

        <div style={{ marginBottom: "30px", fontStyle: "italic" }}>
          Wassalamu &apos;alaikum Warohmatullahi Wabarokatuh.
        </div>

        {/* Signatures */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "40px",
            alignItems: "flex-end",
          }}
        >
          {/* Left Signature */}
          <div style={{ width: "45%" }}>
            <br />
            <div>Ketua Program Studi</div>
            <br />
            <br />
            <br />
            <br />
            <div
              style={{
                borderBottom: "1px dotted black",
                width: "100%",
                marginBottom: "5px",
              }}
            >
              &nbsp;
            </div>
            <div>
              NIP. ........................................................
            </div>
          </div>

          {/* Right Signature */}
          <div style={{ width: "45%", textAlign: "left", paddingLeft: "50px" }}>
            <div style={{ marginBottom: "5px" }}>Hormat saya,</div>
            <br />
            <br />
            <br />
            <br />
            <div
              style={{
                borderBottom: "1px dotted black",
                width: "100%",
                textAlign: "center",
                paddingBottom: "5px",
              }}
            >
              {mhs.nama || "......................................."}
            </div>
          </div>
        </div>

        {/* Advisors */}
        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginBottom: "15px",
            }}
          >
            <div style={{ width: "120px", paddingBottom: "5px" }}>
              Pembimbing I :
            </div>
            <div
              style={{
                flexGrow: 1,
                borderBottom: "1px dotted black",
                paddingBottom: "5px",
              }}
            >
              {mhs.pembimbing1?.nama
                ? mhs.pembimbing1.nama
                : "......................................................................."}
            </div>
            <div style={{ marginLeft: "10px", paddingBottom: "5px" }}>
              (.......................................................)
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div style={{ width: "120px", paddingBottom: "5px" }}>
              Pembimbing II :
            </div>
            <div
              style={{
                flexGrow: 1,
                borderBottom: "1px dotted black",
                paddingBottom: "5px",
              }}
            >
              {mhs.pembimbing2?.nama
                ? mhs.pembimbing2.nama
                : "......................................................................."}
            </div>
            <div style={{ marginLeft: "10px", paddingBottom: "5px" }}>
              (.......................................................)
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div style={{ fontSize: "10pt" }}>
          <div style={{ marginBottom: "5px" }}>
            *) Catatan lampiran pengajuan:
          </div>
          <ul style={{ listStyleType: "none", paddingLeft: "15px", margin: 0 }}>
            <li
              style={{
                marginBottom: "3px",
                textIndent: "-15px",
                paddingLeft: "15px",
              }}
            >
              - Formulir di isi lengkap (Pembimbing diisi KaProdi dan ditanda
              tangani pembimbing yang bersangkutan setelah di ACC KaProdi)
            </li>
            <li
              style={{
                marginBottom: "3px",
                textIndent: "-15px",
                paddingLeft: "15px",
              }}
            >
              - Rancangan penelitian beserta kelengkapannya
            </li>
            <li
              style={{
                marginBottom: "3px",
                textIndent: "-15px",
                paddingLeft: "15px",
              }}
            >
              - Photocopy KTM
            </li>
            <li
              style={{
                marginBottom: "3px",
                textIndent: "-15px",
                paddingLeft: "15px",
              }}
            >
              - Photocopy kwitansi pembayaran SPP semester berjalan
            </li>
            <li
              style={{
                marginBottom: "3px",
                textIndent: "-15px",
                paddingLeft: "15px",
              }}
            >
              - Photocopy KST yang tercantum Skripsi
            </li>
            <li
              style={{
                marginBottom: "3px",
                textIndent: "-15px",
                paddingLeft: "15px",
              }}
            >
              - Photocopy Transkrip Nilai
            </li>
            <li
              style={{
                marginBottom: "3px",
                textIndent: "-15px",
                paddingLeft: "15px",
              }}
            >
              - Seluruh berkas dimasukkan dalam map plastik transparan warna
              biru
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
});

SuratPengajuanJudul.displayName = "SuratPengajuanJudul";
export default SuratPengajuanJudul;
