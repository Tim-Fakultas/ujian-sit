// app/(sekprodi)/pendaftaran-ujian/loading.tsx
export default function Loading() {
  return (
    <div className="p-6">
      <div className="rounded-xl border bg-white p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-8 w-20 rounded-lg ${
                  i === 0 ? "bg-violet-200" : "bg-gray-100"
                } animate-pulse`}
              />
            ))}
          </div>
          <div className="h-8 w-64 rounded-md bg-gray-100 animate-pulse" />
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div
            className="overflow-x-auto"
            style={{
              minHeight: 420, // set minHeight sesuai tinggi table normal
              minWidth: 900, // set minWidth agar tidak berubah saat loading/data
            }}
          >
            <table className="min-w-[900px] w-full text-xs">
              <thead>
                <tr>
                  {[
                    "No",
                    "Mahasiswa",
                    "Judul",
                    "Jenis",
                    "Nilai Akhir",
                    "Hasil",
                    "Aksi",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left text-xs font-semibold bg-gray-50"
                    >
                      <div className="h-4 w-16 bg-gray-100 rounded" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    {Array(7)
                      .fill(0)
                      .map((_, j) => (
                        <td key={j} className="px-3 py-3">
                          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
