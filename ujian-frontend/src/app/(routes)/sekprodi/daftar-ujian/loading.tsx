// app/(sekprodi)/pendaftaran-ujian/loading.tsx
export default function Loading() {
  return (
    <div className="p-6 space-y-3">
      <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
      <div className="border rounded-md p-4 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-4 w-full bg-gray-100 rounded animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
