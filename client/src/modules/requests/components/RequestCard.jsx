import { motion } from "framer-motion";
import {
  Bell,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getToneClasses,
  getUrgencyClasses,
} from "../data/requestCatalog.js";

export default function RequestCard({
  request,
  variants,
}) {
  const MotionArticle = motion.article;
  const navigate = useNavigate();
  const tone = getToneClasses(request.tone);
  const urgencyStyles = getUrgencyClasses(request.urgency);

  return (
    <MotionArticle
      variants={variants}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/requests/${request.id}`)}
      className="cursor-pointer overflow-hidden rounded-[2rem] border border-[#dbe4ee] bg-[rgba(255,255,255,0.96)] shadow-[0_22px_48px_rgba(15,23,42,0.07)] transition hover:border-[#bccddd]"
    >
      <div className={`h-1.5 ${tone.line}`} />
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg ${tone.icon}`}
          >
            <request.icon size={20} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                {request.category}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold ${urgencyStyles}`}
              >
                {request.urgency}
              </span>
            </div>
            <h3 className="mt-4 text-[1.65rem] font-bold leading-8 text-slate-900">
              {request.title}
            </h3>
          </div>
        </div>

        <p className="mt-4 min-h-[72px] text-sm leading-7 text-slate-500">
          {request.description}
        </p>

        <div className="mt-5 rounded-2xl border border-[#e7eef5] bg-[#f8fbfe] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#233b5d] text-sm font-bold text-white">
              {request.avatar}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800">{request.requester}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 text-amber-500">
                  <Star size={12} fill="currentColor" />
                  {request.rating}
                </span>
                {request.requesterVerified ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <ShieldCheck size={12} />
                    Verified
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} className="text-[#35557e]" />
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

        <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <Wallet size={16} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-500">
                  {request.paymentAmount > 0 ? "Payment" : "Support"}
                </p>
                <p className="mt-1 text-lg font-bold text-emerald-700">
                  {request.payment}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
              {request.paymentAmount > 0 ? "Paid Task" : "Volunteer"}
            </span>
          </div>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#dbe4ee] bg-[#f6f9fc] px-4 py-2 text-sm font-semibold text-[#35557e]">
          Open request details
        </div>
      </div>
    </MotionArticle>
  );
}
