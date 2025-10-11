# Dynamic Breadcrumb System

Sistem breadcrumb dinamis yang fleksibel untuk aplikasi e-skripsi. Breadcrumb akan otomatis dibuat berdasarkan URL path atau dapat dikustomisasi menggunakan context.

## Fitur

- **Otomatis**: Breadcrumb dibuat otomatis berdasarkan URL path
- **Customizable**: Halaman dapat mengeset breadcrumb custom menggunakan context
- **Responsive**: Menggunakan UI components yang sudah responsive
- **Type-safe**: Dibuat dengan TypeScript untuk type safety

## Komponen

### 1. DynamicBreadcrumb

Komponen utama yang menampilkan breadcrumb di header.

### 2. BreadcrumbProvider

Context provider yang memungkinkan halaman mengeset custom breadcrumb.

### 3. useBreadcrumb

Hook untuk mendapatkan data breadcrumb.

### 4. useSetBreadcrumb

Hook untuk halaman yang ingin mengeset custom breadcrumb.

## Penggunaan

### Breadcrumb Otomatis

Breadcrumb akan otomatis muncul berdasarkan URL path:

- `/mahasiswa/dashboard` → Home > Mahasiswa > Dashboard
- `/admin/user-management` → Home > Admin > Manajemen User
- `/dosen/bimbingan/123` → Home > Dosen > Bimbingan > Detail

### Custom Breadcrumb

Untuk mengeset breadcrumb custom di halaman tertentu:

```tsx
"use client";

import { useSetBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";

export default function DetailMahasiswaPage() {
  const { setBreadcrumb } = useSetBreadcrumb();

  useEffect(() => {
    setBreadcrumb(
      [
        { label: "Home", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Manajemen User", href: "/admin/user-management" },
        { label: "John Doe", isActive: true },
      ],
      "Detail Mahasiswa John Doe"
    );
  }, [setBreadcrumb]);

  return <div>{/* Konten halaman */}</div>;
}
```

### Clear Custom Breadcrumb

```tsx
const { clearCustomBreadcrumbs } = useSetBreadcrumb();

useEffect(() => {
  return () => {
    clearCustomBreadcrumbs();
  };
}, [clearCustomBreadcrumbs]);
```

## Konfigurasi Route Labels

Route labels dapat dikonfigurasi di file `useBreadcrumb.ts`:

```typescript
const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  "user-management": "Manajemen User",
  "pengajuan-judul": "Pengajuan Judul",
  // ... tambahkan mapping lainnya
};
```

## Dynamic Routes

Sistem ini otomatis mendeteksi:

- **UUID**: `a1b2c3d4-e5f6-7890-abcd-ef1234567890` → "Detail"
- **Numeric ID**: `123` → "Detail"
- **Action routes**: `create`, `edit` → "Buat Baru", "Edit"

## Struktur File

```
src/
├── components/
│   ├── dynamic-breadcrumb.tsx      # Komponen breadcrumb utama
│   └── site-header.tsx             # Header dengan breadcrumb
├── contexts/
│   └── BreadcrumbContext.tsx       # Context provider
├── hooks/
│   └── useBreadcrumb.ts           # Hook breadcrumb
└── app/
    └── (routes)/
        └── layout.tsx             # Layout dengan BreadcrumbProvider
```

## Styling

Breadcrumb menggunakan komponen UI yang sudah ada:

- Responsive design
- Dark/light mode support
- Consistent dengan design system

## Tips

1. **Performance**: Custom breadcrumb hanya diset jika diperlukan
2. **Accessibility**: Breadcrumb include proper ARIA labels
3. **SEO**: Breadcrumb membantu struktur navigasi untuk search engines
4. **UX**: Breadcrumb memberikan context lokasi user dalam aplikasi

## Troubleshooting

### Context Error

Jika muncul error "useBreadcrumbContext must be used within a BreadcrumbProvider", pastikan komponen ada dalam BreadcrumbProvider di layout.

### Breadcrumb Tidak Muncul

1. Cek apakah path tidak dalam excludes list (login, home, etc.)
2. Pastikan minimal 2 level path untuk breadcrumb muncul
3. Cek console untuk error
