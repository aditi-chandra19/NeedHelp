import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import NeedHelpLogo from "../../common/components/NeedHelpLogo.jsx";

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
  const compactHighlights = highlights.slice(0, 2);

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
          className="absolute right-[10%] top-12 h-52 w-52 rounded-full bg-[#dbe7f7]/58 blur-3xl"
        />
      </div>

      <div className="relative z-10 px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-6xl">
          <Link to="/" className="inline-flex min-w-0">
            <NeedHelpLogo
              className="max-w-[14rem]"
              textClassName="text-[1.15rem] md:text-[1.8rem]"
              taglineClassName="text-[0.67rem]"
            />
          </Link>
        </div>

        <MotionDiv
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="mx-auto mt-8 grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <MotionSection
            variants={fadeUp}
            className="nh-panel-soft border border-[#e4ebf3] p-5 lg:hidden"
          >
            <span className="nh-kicker">{eyebrow}</span>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
              {heading}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {description}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {compactHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[1.15rem] border border-[#e4ebf3] bg-white px-4 py-3"
                >
                  <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <CheckCircle2 size={15} />
                  </span>
                  <span className="text-sm leading-6 text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </MotionSection>

          <MotionAside
            variants={fadeUp}
            className="hidden max-w-xl lg:block"
          >
            <span className="nh-kicker">{eyebrow}</span>

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
            <div className="mb-8 border-b border-[#e5ecf3] pb-6 text-center">
              <div className="mb-4 flex justify-center">
                <NeedHelpLogo
                  showTagline={false}
                  textClassName="text-[1.85rem]"
                  className="justify-center"
                />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f7ea8]">
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
