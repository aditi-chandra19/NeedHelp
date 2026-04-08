const steps = [
  { number: 1, label: "Basics" },
  { number: 2, label: "Category" },
  { number: 3, label: "Review" },
];

export default function PostStepIndicator({ currentStep }) {
  return (
    <div className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-[1.75rem] border border-[#dfe8f1] bg-[rgba(255,255,255,0.94)] px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-3">
          <div className="text-center">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition ${
                currentStep >= step.number
                  ? "bg-[#233b5d] text-white shadow-[0_12px_24px_rgba(35,59,93,0.16)]"
                  : "bg-[#eef3f8] text-slate-500"
              }`}
            >
              {step.number}
            </div>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {step.label}
            </p>
          </div>
          {index < steps.length - 1 ? (
            <div
              className={`h-1 w-12 rounded-full ${
                currentStep > step.number ? "bg-[#5f80af]" : "bg-[#dbe4ee]"
              }`}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
