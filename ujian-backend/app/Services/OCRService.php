<?php

namespace App\Services;

use thiagoalessio\TesseractOCR\TesseractOCR;

/**
 * OCRService — Service untuk Optical Character Recognition (OCR).
 *
 * Menggunakan TesseractOCR untuk mengekstrak teks dari gambar/dokumen.
 * Saat ini dikonfigurasi untuk bahasa Indonesia ('ind').
 *
 * Dependensi: `thiagoalessio/tesseract_ocr` (composer package)
 * dan Tesseract OCR binary harus terinstall di server.
 */
class OCRService
{
    /**
     * Ekstrak teks dari file gambar/dokumen.
     *
     * @param  string  $filePath  Path absolut ke file yang akan di-OCR
     * @return string  Teks hasil ekstraksi
     */
    public function extractText(string $filePath): string
    {
        return (new TesseractOCR($filePath))
            ->lang('ind')
            ->run();
    }
}
