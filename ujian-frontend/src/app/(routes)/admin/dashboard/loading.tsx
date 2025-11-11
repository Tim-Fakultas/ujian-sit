export default function Loading() {
  return (
    <div className="p-6 flex flex-col min-h-[60vh] animate-pulse">
      <div className="max-w-full">
        <div className="font-semibold text-gray-300 mb-2 text-sm bg-gray-200 rounded w-32 h-5" />
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 border border-gray-200 rounded-xl p-4 min-w-[180px] max-w-[260px] flex flex-col items-start justify-center shadow-sm"
            >
              <span className="text-xs text-gray-300 mb-1 bg-gray-200 rounded w-24 h-4" />
              <span className="text-2xl font-bold text-gray-300 bg-gray-200 rounded w-16 h-8 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
