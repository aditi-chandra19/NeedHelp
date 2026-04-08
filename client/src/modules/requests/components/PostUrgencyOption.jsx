import { AlertTriangle, Clock3, Flame, Leaf } from "lucide-react";

const urgencyStyles = {
  Emergency: {
    active: "border-rose-300 bg-rose-50 text-rose-700 shadow-[0_12px_24px_rgba(190,24,93,0.08)]",
    inactive: "border-rose-200 bg-white text-rose-700 hover:bg-rose-50/60",
  },
  High: {
    active: "border-orange-300 bg-orange-50 text-orange-700 shadow-[0_12px_24px_rgba(194,65,12,0.08)]",
    inactive: "border-orange-200 bg-white text-orange-700 hover:bg-orange-50/60",
  },
  Medium: {
    active: "border-amber-300 bg-amber-50 text-amber-700 shadow-[0_12px_24px_rgba(180,83,9,0.08)]",
    inactive: "border-amber-200 bg-white text-amber-700 hover:bg-amber-50/60",
  },
  Low: {
    active: "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-[0_12px_24px_rgba(5,150,105,0.08)]",
    inactive: "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50/60",
  },
};

const urgencyIcons = {
  Emergency: AlertTriangle,
  High: Flame,
  Medium: Clock3,
  Low: Leaf,
};

export default function PostUrgencyOption({ option, selected, onSelect }) {
  const styles = urgencyStyles[option.value] || urgencyStyles.Medium;
  const Icon = urgencyIcons[option.value] || Clock3;

  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
        selected ? styles.active : styles.inactive
      }`}
    >
      <Icon size={18} />
      <div>
        <p className="text-sm font-semibold">{option.value}</p>
        <p className="text-xs opacity-80">{option.description}</p>
      </div>
    </button>
  );
}
