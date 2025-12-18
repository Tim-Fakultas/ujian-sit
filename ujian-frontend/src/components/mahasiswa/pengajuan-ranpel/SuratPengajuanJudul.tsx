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
  const prodi = pengajuan.mahasiswa.prodi || "Sistem Informasi"; // Ganti jika prodi ada di data API
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Fungsi helper untuk membuat garis titik-titik placeholder
  const placeholderLine = (minWidth: number = 200) => (
    <span
      style={{
        display: "inline-block",
        minWidth: minWidth,
        borderBottom: "1px dotted #000",
        height: "1em", // Menjaga tinggi baris
      }}
    >
      &nbsp;
    </span>
  );

  return (
    <div
      ref={ref}
      style={{
        width: 794,
        minHeight: 1123,
        padding: "32px 60px", // Padding disesuaikan agar lebih mirip margin surat
        background: "white",
        color: "black",
        fontFamily: "Times New Roman, Times, serif",
        fontSize: 12, // Ukuran font umum
        lineHeight: 1.5,
      }}
    >
      {/* 1. Header (Kop Surat) */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {/* Kolom Kiri: Logo */}
        <div style={{ width: 100, flexShrink: 0, paddingTop: 10 }}>
          <Image
            src="/images/logo-uin.png" // Pastikan path logo benar
            alt="Logo UIN"
            width={80}
            height={80}
            style={{ width: 80, height: "auto" }}
            priority
          />
        </div>

        {/* Kolom Tengah: Alamat & Formulir Title */}
        <div style={{ flexGrow: 1, textAlign: "center", padding: "0 10px" }}>
          <div style={{ fontWeight: "bold", fontSize: 13, lineHeight: 1.2 }}>
            UIN RADEN FATAH PALEMBANG
          </div>
          <div style={{ fontWeight: "bold", fontSize: 13, lineHeight: 1.2 }}>
            FAKULTAS SAINS DAN TEKNOLOGI
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.2, marginTop: 4 }}>
            Jl. Prof. K.H. Zainal Abidin Fikry Palembang
          </div>
        </div>

        {/* Kolom Kanan: Revisi, Kode, Tgl. Terbit */}
        <div
          style={{
            fontSize: 10,
            textAlign: "left",
            minWidth: 150,
            flexShrink: 0,
            border: "1px solid black",
            padding: 5,
            marginLeft: 10,
          }}
        >
          <div
            style={{
              borderBottom: "1px solid black",
              paddingBottom: 2,
              marginBottom: 2,
            }}
          >
            Formulir
            <br />
            <b style={{ fontSize: 11 }}>
              Pengajuan Judul dan Pembimbing Skripsi
            </b>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ lineHeight: 1.2 }}>Revisi 01</div>
            <div style={{ lineHeight: 1.2 }}>1 Agustus 2018</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ lineHeight: 1.2 }}>Kode</div>
            <div style={{ lineHeight: 1.2 }}>FST. FORM SKRIPSI 01</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ lineHeight: 1.2 }}>Tgl. Terbit</div>
            <div style={{ lineHeight: 1.2 }}>1 Pebruari 2018</div>
          </div>
        </div>
      </div>

      {/* Garis Pemisah (Sederhana) */}
      <hr style={{ border: "1px solid #000", margin: "8px 0 16px 0" }} />

      {/* 2. Body Surat */}
      <div style={{ fontSize: 12 }}>
        {/* Tanggal Surat */}
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          Palembang, {placeholderLine(200)}
        </div>

        {/* Perihal & Alamat Tujuan */}
        <table style={{ marginBottom: 16 }}>
          <tbody>
            <tr>
              <td style={{ width: 60, verticalAlign: "top" }}>Perihal</td>
              <td style={{ width: 10, verticalAlign: "top" }}>:</td>
              <td style={{ fontWeight: "bold" }}>
                Permohonan Judul &amp; Pembimbing Skripsi
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginBottom: 16 }}>
          Kepada Yth.
          <br />
          Ketua Program Studi {pengajuan.mahasiswa.prodi.nama}
          <br />
          Fakultas Sains dan Teknologi
          <br />
          Universitas Islam Negeri Raden Fatah Palembang
        </div>

        {/* Pembukaan */}
        <div style={{ marginBottom: 16 }}>
          Assalamu &apos;alaikum Warohmatullahi Wabarakatuh.
        </div>
        <div style={{ marginBottom: 16, textAlign: "justify" }}>
          Saya yang bertanda tangan di bawah ini, mahasiswa Program Studi Sistem
          Informasi Fakultas Sains dan Teknologi Universitas Islam Negeri Raden
          Fatah Palembang.
        </div>

        {/* Data Mahasiswa */}
        <table style={{ marginBottom: 16, marginLeft: 20 }}>
          <tbody>
            <tr>
              <td style={{ width: 100 }}>Nama</td>
              <td>: {mhs?.nama || placeholderLine(300)}</td>
            </tr>
            <tr>
              <td>NIM</td>
              <td>: {mhs?.nim || placeholderLine(300)}</td>
            </tr>
            <tr>
              <td>Semester</td>
              <td>: {mhs?.semester || placeholderLine(300)}</td>
            </tr>
          </tbody>
        </table>

        {/* Pengajuan Judul */}
        <div style={{ marginBottom: 8, textAlign: "justify" }}>
          Sehubungan dengan akan berakhirnya studi saya, maka dengan ini
          mengajukan permohonan judul dan pembimbing Skripsi.
        </div>
        <div style={{ marginBottom: 8 }}>
          Adapun judul yang saya ajukan sebagai berikut:
        </div>
        <ol style={{ marginLeft: 20, marginBottom: 16, paddingLeft: 10 }}>
          <li>{pengajuan.ranpel.judulPenelitian || placeholderLine(500)}</li>
          <li style={{ marginTop: 5 }}>{placeholderLine(500)}</li>
          <li style={{ marginTop: 5 }}>{placeholderLine(500)}</li>
        </ol>

        {/* Penutup */}
        <div style={{ marginBottom: 8 }}>
          Atas perhatiannya, saya ucapkan terima kasih.
        </div>
        <div style={{ marginBottom: 32 }}>
          Wassalamu &apos;alaikum Warohmatullahi Wabarokatuh.
        </div>

        {/* 3. Tanda Tangan */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 32,
          }}
        >
          {/* Kiri: Ketua Program Studi */}
          <div style={{ minWidth: 250 }}>
            Ketua Program Studi
            <br />
            <br />
            {/* Jarak untuk Tanda Tangan */}
            <br />
            <br />
            <br />
            {/* Nama & NIP */}
            {placeholderLine(200)}
            <br />
            NIP. {placeholderLine(150)}
          </div>

          {/* Kanan: Hormat saya */}
          <div style={{ minWidth: 250, textAlign: "right" }}>
            Hormat saya,
            <br />
            <br />
            {/* Jarak untuk Tanda Tangan */}
            <br />
            <br />
            <br />
            {/* Nama Mahasiswa */}
            <div
              style={{
                minWidth: 200,
                borderBottom: "1px dotted #000",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              {mhs?.nama || placeholderLine(200)}
            </div>
          </div>
        </div>

        {/* Pembimbing I & II (di bawah) */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", marginBottom: 5 }}>
            <div style={{ width: 100 }}>Pembimbing I:</div>
            <div style={{ flexGrow: 1 }}>
              {mhs?.pembimbing1?.nama || placeholderLine(250)}{" "}
              (....................................................)
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ width: 100 }}>Pembimbing II:</div>
            <div style={{ flexGrow: 1 }}>
              {mhs?.pembimbing2?.nama || placeholderLine(250)}{" "}
              (....................................................)
            </div>
          </div>
        </div>

        {/* 4. Catatan Lampiran */}
        <div style={{ marginTop: 24, fontSize: 12 }}>
          <div style={{ marginBottom: 5 }}>
            <b style={{ textDecoration: "underline" }}>
              *) Catatan lampiran pengajuan:
            </b>
          </div>
          <ul style={{ marginLeft: 0, paddingLeft: 20, listStyle: "none" }}>
            <li style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "-15px" }}>
                {/*(*/}
              </span>
              Formulir di isi lengkap (Pembimbing diisi KaProdi dan ditanda
              tangani pembimbing yang bersangkutan setelah di ACC KaProdi)
              <span style={{ position: "absolute", right: 0 }}>{/*)*/}</span>
            </li>
            <li style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "-15px" }}>
                {/*(*/}
              </span>
              Rancangan penelitian beserta kelengkapannya
              <span style={{ position: "absolute", right: 0 }}>{/*)*/}</span>
            </li>
            <li style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "-15px" }}>
                {/*(*/}
              </span>
              Photocopy KTM
              <span style={{ position: "absolute", right: 0 }}>{/*)*/}</span>
            </li>
            <li style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "-15px" }}>
                {/*(*/}
              </span>
              Photocopy kwitansi pembayaran SPP semester berjalan
              <span style={{ position: "absolute", right: 0 }}>{/*)*/}</span>
            </li>
            <li style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "-15px" }}>
                {/*(*/}
              </span>
              Photocopy KST yang tercantum Skripsi
              <span style={{ position: "absolute", right: 0 }}>{/*)*/}</span>
            </li>
            <li style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "-15px" }}>
                {/*(*/}
              </span>
              Photocopy Transkrip Nilai
              <span style={{ position: "absolute", right: 0 }}>{/*)*/}</span>
            </li>
            <li style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "-15px" }}>
                {/*(*/}
              </span>
              Seluruh berkas dimasukkan dalam map plastik transparan warna biru
              <span style={{ position: "absolute", right: 0 }}>{/*)*/}</span>
            </li>
          </ul>
          {/* Untuk tanda kurung di akhir baris, perlu penyesuaian styling lebih lanjut, saat ini saya buat sebagai komentar */}
        </div>
      </div>
    </div>
  );
});

SuratPengajuanJudul.displayName = "SuratPengajuanJudul";
export default SuratPengajuanJudul;
