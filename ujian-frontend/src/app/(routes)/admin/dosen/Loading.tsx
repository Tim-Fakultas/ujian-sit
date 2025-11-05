export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-400 border-t-transparent" />
      <div className="text-lg font-semibold text-neutral-700">
        Memuat Data Dosen...
      </div>
    </div>
  );
}
