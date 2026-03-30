import { motion } from "framer-motion";
import { Bell, HeartHandshake, MapPin, ShieldCheck, Star } from "lucide-react";
import { fadeUpItem } from "../animations.js";

export default function UrgentRequestCard({ request }) {
  const MotionArticle = motion.article;

  return (
    <MotionArticle
      variants={fadeUpItem}
      whileHover={{ y: -10 }}
      className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 shadow-[0_30px_70px_rgba(15,23,42,0.08)]"
    >
      <div className={`h-2 bg-gradient-to-r ${request.accent}`} />
      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {request.category}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              request.severity === "Emergency"
                ? "bg-rose-100 text-rose-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            {request.severity}
          </span>
        </div>

        <h3 className="mt-5 text-2xl font-bold leading-9 text-slate-800">
          {request.title}
        </h3>
        <p className="mt-4 text-slate-500">{request.description}</p>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
              {request.avatar}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800">{request.requester}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 text-amber-500">
                  <Star size={12} fill="currentColor" />
                  {request.rating}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <ShieldCheck size={12} />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} className="text-blue-500" />
            {request.distance}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bell size={14} className="text-violet-500" />
            {request.posted}
          </span>
          <span className="inline-flex items-center gap-1">
            <HeartHandshake size={14} className="text-emerald-500" />
            {request.chats}
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {request.tip}
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-500">
                Payment
              </p>
              <p className="mt-1 text-lg font-bold text-emerald-700">{request.payment}</p>
            </div>
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
              Paid Task
            </span>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            className={`flex-1 rounded-xl bg-gradient-to-r px-4 py-3 text-sm font-semibold text-white shadow-lg ${request.accent}`}
          >
            Help Now
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Chat
          </button>
        </div>
      </div>
    </MotionArticle>
  );
}
