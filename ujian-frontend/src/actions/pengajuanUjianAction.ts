import { PengajuanUjian } from "@/types/PengajuanUjian";

export async function getPengajuanUjian(): Promise<PengajuanUjian[]> {
  // Mock data - replace with actual API call
  return [
    {
      id: 1,
      mahasiswa: {
        id: 1,
        nim: "20220001",
        nama: "Ahmad Rizky Pratama",
        prodi: { id: 1, nama: "Sistem Informasi" },
      },
      judulSkripsi: "Sistem Informasi Manajemen Perpustakaan Berbasis Web",
      deskripsi:
        "Pengembangan sistem informasi untuk mengelola data perpustakaan dengan fitur peminjaman dan pengembalian buku secara digital.",
      tanggalPengajuan: "2024-01-15",
      status: "pending",
      pembimbing1: {
        id: 1,
        nama: "Dr. Budi Santoso, M.Kom",
        nidn: "0123456789",
      },
      pembimbing2: { id: 2, nama: "Sari Indah, M.T", nidn: "0987654321" },
    },
    {
      id: 2,
      mahasiswa: {
        id: 2,
        nim: "20220002",
        nama: "Siti Nurhaliza",
        prodi: { id: 1, nama: "Sistem Informasi" },
      },
      judulSkripsi: "Aplikasi Mobile E-Commerce untuk UMKM",
      deskripsi:
        "Pengembangan aplikasi mobile untuk membantu UMKM dalam memasarkan produk mereka secara online.",
      tanggalPengajuan: "2024-01-20",
      status: "pending",
      pembimbing1: {
        id: 3,
        nama: "Prof. Dr. Andi Wijaya, M.Sc",
        nidn: "1234567890",
      },
    },
  ];
}

export async function createPengajuanUjian(formData: FormData) {
  // Mock implementation - replace with actual API call
  return { success: true, message: "Pengajuan ujian berhasil dibuat" };
}

export async function buatSKPembimbing(id: number, formData: FormData) {
  // Mock implementation - replace with actual API call
  return { success: true, message: "SK Pembimbing berhasil dibuat" };
}

export async function updateStatusPengajuan(
  id: number,
  status: string,
  catatan?: string
) {
  // Mock implementation - replace with actual API call
  return { success: true, message: "Status pengajuan berhasil diupdate" };
}
