import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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
    <section className="px-4 pb-14 pt-12 md:px-6 md:pb-20 md:pt-14">
      <MotionDiv
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="mx-auto max-w-6xl"
      >
        <div className="grid items-start gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-3xl">
            <MotionDiv variants={fadeUpItem}>
              <span className="nh-kicker">
                <ShieldCheck size={14} />
                Built for local trust and quick action
              </span>
            </MotionDiv>

            <MotionDiv
              variants={fadeUpItem}
              className="mt-8 max-w-3xl text-balance text-5xl font-black tracking-tight text-slate-900 sm:text-6xl md:text-7xl"
            >
              <span>{title}</span>
            </MotionDiv>

            <MotionDiv
              variants={fadeUpItem}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl"
            >
              Connect with <span className="font-semibold text-[#233b5d]">trusted neighbors</span> for instant help.
              From fixing taps to blood donation, find help nearby in <span className="font-semibold text-emerald-700">minutes</span>.
            </MotionDiv>

            <MotionDiv variants={fadeUpItem} className="mt-6">
              <div className="nh-panel-soft inline-flex max-w-xl items-start gap-3 px-4 py-4">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-[#233b5d] text-white">
                  <Sparkles size={16} />
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  NeedHelp is designed like a neighborhood utility, not a social feed. Clear requests, verified profiles, and practical follow-through come first.
                </p>
              </div>
            </MotionDiv>

            <MotionForm
              variants={fadeUpItem}
              onSubmit={onSearchSubmit}
              className="nh-panel mt-10 flex max-w-3xl flex-col gap-3 p-3 sm:flex-row"
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
                  className="nh-input h-14 pl-12"
                />
              </div>

              <button
                type="submit"
                className="nh-button-primary h-14 px-8"
              >
                Search
              </button>
            </MotionForm>

            <MotionDiv variants={fadeUpItem} className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/post"
                className="nh-button-primary px-6 py-4"
              >
                Request Help
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/browse"
                className="nh-button-secondary px-6 py-4"
              >
                Browse Requests
              </Link>
            </MotionDiv>
          </div>

          <MotionDiv
            variants={fadeUpItem}
            className="nh-panel relative overflow-hidden p-6"
          >
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#dce8f7] blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5f7ea8]">
                    Community desk
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    What people rely on this week
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#233b5d] text-white">
                  <Sparkles size={20} />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="nh-panel-soft p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f7ea8]">
                    Most active
                  </p>
                  <p className="mt-3 text-3xl font-black text-slate-900">214</p>
                  <p className="mt-1 text-sm text-slate-500">Live requests nearby</p>
                </div>
                <div className="rounded-2xl border border-[#dfe8f1] bg-[#f5f9fd] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#35557e]">
                    Fastest zone
                  </p>
                  <p className="mt-3 text-3xl font-black text-slate-900">3.8m</p>
                  <p className="mt-1 text-sm text-slate-500">Average first response</p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-[#e1eaf2] bg-[#fbfdff] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Verified neighborhoods</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Active in Delhi NCR, Jaipur, Pune and Bengaluru
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Live
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    "OTP verified members and phone trust checks",
                    "Payment-backed tasks for higher accountability",
                    "Emergency routing for urgent community needs",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle2 size={13} />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="nh-tag border border-[#dbe4ee] bg-white px-4 py-2 text-sm text-slate-600">
                  <MapPin size={14} className="text-[#35557e]" />
                  Nearest help in under 5 minutes
                </div>
                <div className="nh-tag border border-[#dbe4ee] bg-white px-4 py-2 text-sm text-slate-600">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  Verified profiles first
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>

        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {heroStats.map((stat, index) => (
            <MotionDiv
              key={stat.label}
              variants={fadeUpItem}
              whileHover={{ y: -6 }}
              className={`nh-panel-soft p-8 text-left ${index === 0 ? "sm:col-span-2 xl:col-span-2" : ""}`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg ${stat.accent}`}
              >
                <stat.icon size={22} />
              </div>
              <p className="mt-8 text-4xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-3 text-sm text-slate-500">{stat.label}</p>
            </MotionDiv>
          ))}
        </MotionDiv>
      </MotionDiv>
    </section>
  );
}
