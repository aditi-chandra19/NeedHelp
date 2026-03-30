import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function ComingSoonPage({
  title,
  description,
  backTo = "/home",
  ctaLabel = "Back to Home",
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-rose-50 px-4 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl items-center justify-center">
        <div className="w-full rounded-[2rem] bg-white/95 p-8 text-center shadow-2xl shadow-slate-200/70 sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-200">
            <Sparkles size={28} />
          </div>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-violet-500">
            NeedHelp
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500">
            {description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to={backTo}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-200"
            >
              <ArrowLeft size={16} />
              {ctaLabel}
            </Link>
            <Link
              to="/post"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Post a Request
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
