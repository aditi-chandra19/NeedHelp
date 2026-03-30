import { getToneClasses } from "../data/requestCatalog.js";

export default function PostCategoryOption({ category, selected, onSelect }) {
  const tone = getToneClasses(category.tone);

  return (
    <button
      type="button"
      onClick={() => onSelect(category.slug)}
      className={`rounded-2xl border px-4 py-5 text-center transition ${
        selected
          ? "border-[#5f80af] bg-[#eef3f8] shadow-[0_18px_40px_rgba(35,59,93,0.1)]"
          : "border-[#ddd4c7] bg-[#fffdf8] hover:border-[#cfc2ae] hover:bg-white"
      }`}
    >
      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${tone.icon}`}
      >
        <category.icon size={22} />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-800">{category.label}</p>
    </button>
  );
}
