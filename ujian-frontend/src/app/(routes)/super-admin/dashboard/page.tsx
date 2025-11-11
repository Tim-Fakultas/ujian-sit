async function getTotalDosen() {
  const res = await fetch("http://localhost:8000/api/dosen", {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}
async function getTotalMahasiswa() {
  const res = await fetch("http://localhost:8000/api/mahasiswa", {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}
async function getTotalPeminatan() {
  const res = await fetch("http://localhost:8000/api/peminatan", {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}
async function getTotalProdi() {
  const res = await fetch("http://localhost:8000/api/prodi", {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}

export default async function Page() {
  const totalDosen = await getTotalDosen();
  const totalMahasiswa = await getTotalMahasiswa();
  const totalPeminatan = await getTotalPeminatan();
  const totalProdi = await getTotalProdi();

  return (
    <div className="p-6 flex flex-col min-h-[60vh]">
      <div className="max-w-full">
        <div className="font-semibold text-gray-700 mb-2 text-sm">
          Faculty of Science & Technology
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 min-w-[160px] max-w-[220px] flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Total Dosen</span>
            <span className="text-2xl font-bold text-blue-700">
              {totalDosen}
            </span>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 min-w-[160px] max-w-[220px] flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Total Mahasiswa</span>
            <span className="text-2xl font-bold text-green-700">
              {totalMahasiswa}
            </span>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 min-w-[160px] max-w-[220px] flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Total Peminatan</span>
            <span className="text-2xl font-bold text-purple-700">
              {totalPeminatan}
            </span>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 min-w-[160px] max-w-[220px] flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Total Prodi</span>
            <span className="text-2xl font-bold text-yellow-700">
              {totalProdi}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
