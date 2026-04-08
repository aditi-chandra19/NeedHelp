import { motion } from "framer-motion";
import { MapPinned, Navigation } from "lucide-react";
import { buildMapMarkers } from "../data/requestCatalog.js";

const toneDotClasses = {
  sky: "bg-sky-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  orange: "bg-orange-500",
  indigo: "bg-indigo-500",
  slate: "bg-slate-500",
};

const toneGlowClasses = {
  sky: "bg-sky-500/20",
  rose: "bg-rose-500/20",
  amber: "bg-amber-500/20",
  emerald: "bg-emerald-500/20",
  teal: "bg-teal-500/20",
  orange: "bg-orange-500/20",
  indigo: "bg-indigo-500/20",
  slate: "bg-slate-500/20",
};

export default function NeedHelpMap({
  requests = [],
  mode = "browse",
  heightClass = "h-[34rem]",
  centerLabel = "Interactive nearby requests",
}) {
  const MotionDiv = motion.div;
  const markers = buildMapMarkers(requests);
  const visibleMarkers = mode === "detail" ? markers.slice(0, 1) : markers.slice(0, 5);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[#d8e3ee] bg-white shadow-[0_22px_54px_rgba(20,32,51,0.08)]">
      <div
        className={`relative ${heightClass} overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(229,239,250,0.95),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(223,242,235,0.72),transparent_24%),linear-gradient(180deg,#f7fbff_0%,#eef4fb_100%)]`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.62)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.62)_1px,transparent_1px)] bg-[size:84px_84px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(32,70,111,0.05),transparent_34%)]" />

        <MotionDiv
          animate={{ x: [0, 24, 0], y: [0, 14, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[18%] top-[24%] h-3.5 w-3.5 rounded-full bg-sky-200"
        />
        <MotionDiv
          animate={{ x: [0, -18, 0], y: [0, 18, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[18%] top-[30%] h-4 w-4 rounded-full bg-indigo-200"
        />
        <MotionDiv
          animate={{ x: [0, 12, 0], y: [0, -16, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[58%] bottom-[20%] h-4 w-4 rounded-full bg-emerald-200"
        />

        {visibleMarkers.map((marker, index) => {
          const dotClass = toneDotClasses[marker.tone] || toneDotClasses.sky;
          const glowClass = toneGlowClasses[marker.tone] || toneGlowClasses.sky;

          return (
            <MotionDiv
              key={marker.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: 1,
                y: [0, -6, 0],
              }}
              transition={{
                opacity: { duration: 0.4, delay: index * 0.08 },
                y: {
                  duration: 3.8 + index * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${marker.top}%`, left: `${marker.left}%` }}
            >
              <div className={`absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full ${glowClass} blur-2xl`} />
              <MotionDiv
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full ${glowClass}`}
              />

              {mode === "browse" ? (
                <div className="relative min-w-[13.5rem] max-w-[18rem] rounded-[1.35rem] border border-white/80 bg-white/95 px-4 py-3 shadow-[0_18px_42px_rgba(20,32,51,0.12)] backdrop-blur-xl">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 h-3 w-3 rounded-full ${dotClass}`} />
                    <div className="min-w-0">
                      <p className="truncate text-[1rem] font-semibold text-slate-900">
                        {marker.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{marker.distance} away</p>
                      {marker.paymentAmount > 0 ? (
                        <div className="mt-2 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {marker.payment}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative flex flex-col items-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white shadow-[0_18px_38px_rgba(20,32,51,0.14)]">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${dotClass} text-white`}>
                      <marker.icon size={18} />
                    </div>
                  </div>
                  <div className="mt-4 min-w-[15rem] rounded-[1.25rem] border border-white/80 bg-white/94 px-4 py-3 text-center shadow-[0_18px_42px_rgba(20,32,51,0.12)] backdrop-blur-xl">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {marker.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{marker.distance} away</p>
                  </div>
                </div>
              )}
            </MotionDiv>
          );
        })}

        <div className="absolute left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.45rem] border border-white bg-white/95 text-[#20466f] shadow-[0_18px_42px_rgba(20,32,51,0.12)]">
            <MapPinned size={28} />
          </div>
          <h3 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
            Map View
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">{centerLabel}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d8e3ee] bg-white/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#466789] shadow-[0_10px_24px_rgba(20,32,51,0.06)]">
            <Navigation size={13} />
            Live neighborhood movement
          </div>
        </div>
      </div>
    </div>
  );
}
