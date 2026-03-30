const steps = [
  { number: 1, label: "Basics" },
  { number: 2, label: "Category" },
  { number: 3, label: "Review" },
];

export default function PostStepIndicator({ currentStep }) {
  return (
    <div className="mx-auto flex max-w-sm items-center justify-center gap-3">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-3">
          <div className="text-center">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition ${
                currentStep >= step.number
                  ? "bg-[#233b5d] text-white shadow-[0_12px_24px_rgba(35,59,93,0.16)]"
                  : "bg-[#efe8dc] text-slate-500"
              }`}
            >
              {step.number}
            </div>
          </div>
          {index < steps.length - 1 ? (
            <div
              className={`h-1 w-12 rounded-full ${
                currentStep > step.number ? "bg-[#5f80af]" : "bg-[#ddd4c7]"
              }`}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
