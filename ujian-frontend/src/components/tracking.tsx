// Komponen Tracking Step
export default function TrackingStep({ current }: { current: string }) {
  const steps = ["Seminar Proposal", "Seminar Hasil", "Seminar Skripsi"];

  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto my-8">
      {steps.map((step, idx) => {
        const isActive = step === current;
        const isCompleted = steps.indexOf(current) > idx;

        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium border-2
                ${
                  isActive
                    ? "bg-[#636AE8] text-white border-[#636AE8]"
                    : isCompleted
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-gray-100 text-gray-400 border-gray-300"
                }`}
            >
              {idx + 1}
            </div>
            <p
              className={`mt-2 text-xs sm:text-sm font-medium ${
                isActive
                  ? "text-[#636AE8]"
                  : isCompleted
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {step}
            </p>
            {/* Garis penghubung */}
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-full mt-2 ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
