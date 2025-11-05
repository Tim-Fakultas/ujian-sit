<?php
namespace App\Services;

use thiagoalessio\TesseractOCR\TesseractOCR;

class OCRService
{
    public function extractText(string $filePath): string
    {
        return (new TesseractOCR($filePath))
            ->lang('ind') // gunakan 'eng' kalau hasil lebih bagus
            ->run();
    }
}
