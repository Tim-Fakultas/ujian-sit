import FormPengajuan from "@/components/form-pengajuan";

export default function PengajuanPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pengajuan Baru</h1>
        <p className="text-gray-600 mt-2">
          Silakan isi form pengajuan di bawah ini
        </p>
      </div>

        <FormPengajuan />
    </div>
  );
}
