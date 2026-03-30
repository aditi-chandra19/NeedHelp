import { motion } from "framer-motion";
import { CheckCircle2, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function AuthPageShell({
  eyebrow,
  heading,
  description,
  highlights,
  stats,
  cardEyebrow,
  cardTitle,
  cardDescription,
  children,
}) {
  const MotionDiv = motion.div;
  const MotionAside = motion.aside;
  const MotionSection = motion.section;

  return (
    <div className="min-h-screen text-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[22rem] overflow-hidden"
      >
        <MotionDiv
          animate={{ x: [0, 14, 0], y: [0, 10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[9%] top-14 h-52 w-52 rounded-full bg-[#d9e2ee]/55 blur-3xl"
        />
        <MotionDiv
          animate={{ x: [0, -16, 0], y: [0, 10, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-12 h-52 w-52 rounded-full bg-[#eedab7]/52 blur-3xl"
        />
      </div>

      <div className="relative z-10 px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-6xl">
          <Link to="/" className="inline-flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-slate-200 bg-[#233b5d] text-white shadow-[0_12px_28px_rgba(35,59,93,0.16)]">
              <HeartHandshake size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xl font-bold text-slate-900">NeedHelp</p>
              <p className="truncate text-xs text-slate-500">
                Neighbors helping neighbors
              </p>
            </div>
          </Link>
        </div>

        <MotionDiv
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="mx-auto mt-8 grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <MotionAside
            variants={fadeUp}
            className="hidden max-w-xl lg:block"
          >
            <span className="nh-kicker">
              {eyebrow}
            </span>

            <h1 className="mt-8 max-w-3xl text-balance text-5xl font-black tracking-tight text-slate-900 xl:text-6xl">
              {heading}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {description}
            </p>

            <div className="mt-10 grid gap-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="nh-panel-soft flex items-start gap-3 px-4 py-4"
                >
                  <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <CheckCircle2 size={16} />
                  </span>
                  <span className="text-sm leading-6 text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="nh-panel-soft px-5 py-6"
                >
                  <p className="text-[2rem] font-bold text-slate-900">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </MotionAside>

          <MotionSection
            variants={fadeUp}
            className="nh-panel mx-auto w-full max-w-lg overflow-hidden p-6 sm:p-8"
          >
            <div className="mb-8 border-b border-[#ebe3d6] pb-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.15rem] border border-slate-200 bg-[#233b5d] text-white shadow-[0_12px_28px_rgba(35,59,93,0.16)]">
                  <HeartHandshake className="h-7 w-7" />
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b7656]">
                {cardEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {cardTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {cardDescription}
              </p>
            </div>

            {children}
          </MotionSection>
        </MotionDiv>
      </div>
    </div>
  );
}
