import {
  Bike,
  Box,
  BriefcaseMedical,
  Camera,
  GraduationCap,
  HandHelping,
  House,
  Info,
  LaptopMinimal,
  LockKeyhole,
  MapPinned,
  PawPrint,
  PartyPopper,
  ShoppingBag,
  UserRound,
  Wrench,
} from "lucide-react";

export const categoryVisuals = {
  "home-daily": {
    icon: House,
    tone: "sky",
  },
  "vehicle-transport": {
    icon: Bike,
    tone: "amber",
  },
  "medical-emergency": {
    icon: BriefcaseMedical,
    tone: "rose",
  },
  "delivery-pickup": {
    icon: Box,
    tone: "amber",
  },
  "student-help": {
    icon: GraduationCap,
    tone: "emerald",
  },
  "pet-animal-help": {
    icon: PawPrint,
    tone: "orange",
  },
  "personal-help": {
    icon: UserRound,
    tone: "sky",
  },
  "event-social": {
    icon: PartyPopper,
    tone: "indigo",
  },
  "skill-based-help": {
    icon: Wrench,
    tone: "slate",
  },
  "tech-help": {
    icon: LaptopMinimal,
    tone: "teal",
  },
  "shopping-help": {
    icon: ShoppingBag,
    tone: "amber",
  },
  "local-information": {
    icon: Info,
    tone: "sky",
  },
  "unique-requests": {
    icon: Camera,
    tone: "slate",
  },
  "quick-emergency": {
    icon: LockKeyhole,
    tone: "indigo",
  },
};

export const toneClasses = {
  sky: {
    line: "bg-sky-600",
    icon: "bg-sky-600 text-white shadow-sky-200",
    button: "bg-sky-700 hover:bg-sky-800 shadow-sky-200",
  },
  rose: {
    line: "bg-rose-600",
    icon: "bg-rose-600 text-white shadow-rose-200",
    button: "bg-rose-700 hover:bg-rose-800 shadow-rose-200",
  },
  amber: {
    line: "bg-amber-500",
    icon: "bg-amber-500 text-white shadow-amber-200",
    button: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
  },
  emerald: {
    line: "bg-emerald-600",
    icon: "bg-emerald-600 text-white shadow-emerald-200",
    button: "bg-emerald-700 hover:bg-emerald-800 shadow-emerald-200",
  },
  teal: {
    line: "bg-teal-600",
    icon: "bg-teal-600 text-white shadow-teal-200",
    button: "bg-teal-700 hover:bg-teal-800 shadow-teal-200",
  },
  orange: {
    line: "bg-orange-600",
    icon: "bg-orange-600 text-white shadow-orange-200",
    button: "bg-orange-700 hover:bg-orange-800 shadow-orange-200",
  },
  indigo: {
    line: "bg-indigo-600",
    icon: "bg-indigo-600 text-white shadow-indigo-200",
    button: "bg-indigo-700 hover:bg-indigo-800 shadow-indigo-200",
  },
  slate: {
    line: "bg-slate-500",
    icon: "bg-slate-500 text-white shadow-slate-200",
    button: "bg-slate-700 hover:bg-slate-800 shadow-slate-200",
  },
};

export const urgencyClasses = {
  Emergency: "bg-rose-100 text-rose-600",
  High: "bg-amber-100 text-amber-700",
  Medium: "bg-sky-100 text-sky-700",
  Low: "bg-emerald-100 text-emerald-700",
};

export function getCategoryVisual(categorySlug) {
  return categoryVisuals[categorySlug] || { icon: HandHelping, tone: "sky" };
}

export function getToneClasses(tone) {
  return toneClasses[tone] || toneClasses.sky;
}

export function getUrgencyClasses(urgency) {
  return urgencyClasses[urgency] || "bg-slate-100 text-slate-600";
}

export function decorateRequest(request) {
  const visual = getCategoryVisual(request.categorySlug);

  return {
    ...request,
    icon: visual.icon,
    tone: request.tone || visual.tone,
  };
}

export function decorateCategory(category) {
  const visual = getCategoryVisual(category.slug);

  return {
    ...category,
    icon: visual.icon,
    tone: visual.tone,
  };
}

export function buildMapMarkers(requests) {
  if (!requests.length) {
    return [];
  }

  const latitudes = requests.map((request) => request.coordinates.lat);
  const longitudes = requests.map((request) => request.coordinates.lng);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const latRange = Math.max(maxLat - minLat, 0.01);
  const lngRange = Math.max(maxLng - minLng, 0.01);

  return requests.map((request) => {
    const visual = getCategoryVisual(request.categorySlug);

    return {
      ...request,
      icon: visual.icon,
      tone: request.tone || visual.tone,
      top: 12 + ((maxLat - request.coordinates.lat) / latRange) * 68,
      left: 10 + ((request.coordinates.lng - minLng) / lngRange) * 76,
    };
  });
}
