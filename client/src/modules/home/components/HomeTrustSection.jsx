import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fadeUpItem } from "../animations.js";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function HomeTrustSection({ trustFeatures, trustStats }) {
  const MotionDiv = motion.div;

  return (
    <>
      <section className="px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <span className="nh-kicker">Trust and safety</span>
            <h2 className="mt-5 text-5xl font-black tracking-tight text-slate-900">
              Built on Trust &amp; Safety
            </h2>
            <p className="mt-5 max-w-xl text-xl leading-8 text-slate-500">
              Every member is verified, and our karma system ensures you can trust the
              community.
            </p>

            <div className="mt-10 space-y-5">
              {trustFeatures.map((feature) => (
                <div key={feature.title} className="nh-panel-soft flex items-start gap-4 px-4 py-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ${feature.accent}`}
                  >
                    <feature.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                    <p className="mt-1 text-slate-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <MotionDiv
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
            variants={containerVariants}
            className="grid gap-5 sm:grid-cols-2"
          >
            {trustStats.map((stat) => (
              <MotionDiv
                key={stat.label}
                variants={fadeUpItem}
                whileHover={{ y: -8 }}
                className={`rounded-[2rem] border border-transparent p-8 shadow-[0_24px_60px_rgba(15,23,42,0.09)] ${stat.cardClass}`}
              >
                <stat.icon size={28} />
                <p className="mt-12 text-5xl font-black">{stat.value}</p>
                <p className="mt-4 text-lg opacity-90">{stat.label}</p>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </section>

      <section className="px-4 pb-20 pt-4 md:px-6">
        <div className="nh-panel-deep mx-auto max-w-4xl px-6 py-16 text-center md:px-10">
          <h2 className="text-5xl font-black tracking-tight">Ready to join?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-white/85">
            Start helping your community today and earn karma points while building
            trusted local connections.
          </p>
          <div className="mt-10">
            <Link
              to="/post"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-semibold text-[#233b5d] shadow-[0_18px_48px_rgba(255,255,255,0.16)] transition hover:-translate-y-0.5"
            >
              Get Started Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
