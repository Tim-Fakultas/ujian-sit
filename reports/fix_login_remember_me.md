# Bug Fix Report: Login "Remember Me" Validation Error

## Deskripsi Masalah

Pengguna melaporkan bahwa ketika mencentang opsi **"Ingat saya di perangkat ini"** saat login, sistem mengembalikan pesan kesalahan **"Data input tidak valid."** meskipun username dan password sudah benar.

## Analisis Akar Masalah

Masalah terjadi karena ketidakcocokan tipe data antara elemen UI Form dan skema validasi di sisi server (Backend-for-Frontend/BFF):

1.  **UI Component**: Checkbox pada `LoginForm.tsx` menggunakan `FormData` yang mengirimkan string `"on"` saat dicentang.
2.  **Validation Schema**: Skema Zod di `src/lib/validations/auth.ts` sebelumnya didefinisikan sebagai `z.boolean()`.
3.  **Conflict**: Zod menolak string `"on"` karena mengharapkan nilai boolean murni, sehingga memicu kegagalan validasi server-side di `loginAction`.

## Perbaikan yang Dilakukan

### 1. Update Skema Validasi

Mengubah `src/lib/validations/auth.ts` untuk menangani input string dari `FormData` dan mengonversinya menjadi boolean secara otomatis.

```typescript
// SEBELUM
remember: z.boolean().optional();

// SESUDAH
remember: z.union([z.boolean(), z.string()])
  .transform((v) => v === true || v === "on")
  .optional();
```

### 2. Implementasi Durasi Sesi (Session Persistence)

Memperbarui `loginAction` di `src/actions/auth.ts` agar flag `remember` benar-benar berfungsi dengan memperpanjang masa berlaku cookie:

- **Default**: 6 Jam (Sesi pendek)
- **Remembered**: 30 Hari (Sesi panjang)

```typescript
const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 6;
// ... diterapkan pada cookie 'user' dan 'token'
```

## Hasil

- Error "Data input tidak valid" berhasil diatasi.
- Fitur "Ingat saya" sekarang berfungsi secara fungsional untuk menjaga pengguna tetap login selama 30 hari jika opsi tersebut dipilih.

---

**Tanggal Perbaikan:** 10 Februari 2026
**Update Oleh:** Antigravity AI Agent
