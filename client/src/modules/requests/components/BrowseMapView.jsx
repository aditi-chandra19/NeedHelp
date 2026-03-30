import { MapPinned } from "lucide-react";
import { buildMapMarkers, getToneClasses } from "../data/requestCatalog.js";

export default function BrowseMapView({ requests }) {
  const markers = buildMapMarkers(requests);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#ddd4c7] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="relative h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(221,231,243,0.85),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(238,218,183,0.65),_transparent_24%),linear-gradient(180deg,_rgba(250,246,239,0.96)_0%,_rgba(245,240,232,0.98)_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] bg-[size:72px_72px]" />

        {markers.map((marker) => {
          const tone = getToneClasses(marker.tone);

          return (
            <div
              key={marker.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${marker.top}%`, left: `${marker.left}%` }}
            >
              <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300/35 blur-md" />
              <div
                className={`relative flex h-12 w-12 items-center justify-center rounded-full shadow-xl ${tone.icon}`}
              >
                <marker.icon size={18} />
              </div>
            </div>
          );
        })}

        <div className="absolute left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-[#35557e] shadow-lg shadow-slate-200">
            <MapPinned size={30} />
          </div>
          <h3 className="mt-5 text-3xl font-bold text-slate-900">Map View</h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Interactive map for nearby requests. This local prototype uses visual
            markers now and can later be swapped with Google Maps or Mapbox.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-5 border-t border-[#ddd4c7] bg-[#fffdf8] px-5 py-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500" />
          Emergency
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-500" />
          High Priority
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-sky-500" />
          Medium
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          Low
        </span>
      </div>
    </div>
  );
}
