import { motion } from "framer-motion";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUpItem } from "../animations.js";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function HomeHeroSection({
  title,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  heroStats,
}) {
  const MotionDiv = motion.div;
  const MotionForm = motion.form;

  return (
    <section className="px-4 pb-14 pt-12 md:px-6 md:pb-20 md:pt-16">
      <MotionDiv
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="mx-auto max-w-6xl"
      >
        <div className="mx-auto max-w-4xl text-center">
          <MotionDiv variants={fadeUpItem}>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm">
              <ShieldCheck size={14} />
              India&apos;s #1 Hyperlocal Help Platform
            </span>
          </MotionDiv>

          <MotionDiv
            variants={fadeUpItem}
            className="mx-auto mt-8 max-w-3xl text-balance text-5xl font-black tracking-tight text-slate-900 sm:text-6xl md:text-7xl"
          >
            <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-sky-700 bg-clip-text text-transparent">
              {title}
            </span>
          </MotionDiv>

          <MotionDiv
            variants={fadeUpItem}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl"
          >
            Connect with <span className="font-semibold text-indigo-700">trusted neighbors</span> for instant help.
            From fixing taps to blood donation, find help nearby in <span className="font-semibold text-emerald-700">minutes</span>.
          </MotionDiv>

          <MotionForm
            variants={fadeUpItem}
            onSubmit={onSearchSubmit}
            className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="What do you need help with? e.g. flat tyre, blood donor..."
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <button
              type="submit"
              className="h-14 rounded-2xl bg-slate-900 px-8 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-800"
            >
              Search
            </button>
          </MotionForm>

          <MotionDiv variants={fadeUpItem} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/post"
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-800"
            >
              Request Help
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Browse Requests
            </Link>
          </MotionDiv>
        </div>

        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {heroStats.map((stat) => (
            <MotionDiv
              key={stat.label}
              variants={fadeUpItem}
              whileHover={{ y: -6 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
            >
              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg ${stat.accent}`}
              >
                <stat.icon size={22} />
              </div>
              <p className="mt-8 text-4xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-4 text-sm text-slate-500">{stat.label}</p>
            </MotionDiv>
          ))}
        </MotionDiv>
      </MotionDiv>
    </section>
  );
}
