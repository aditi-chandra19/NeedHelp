import { motion } from "framer-motion";
import { fadeUpItem } from "../animations.js";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function HomeHowItWorksSection({ steps }) {
  const MotionDiv = motion.div;

  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="nh-panel-deep px-6 py-12 md:px-10 md:py-14">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75">
              How it works
            </span>
            <h2 className="mt-5 text-center text-4xl font-black tracking-tight">
              A simple flow that feels accountable
            </h2>
          </div>

          <MotionDiv
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="mt-12 grid gap-8 md:grid-cols-3"
          >
            {steps.map((step, index) => (
              <MotionDiv key={step.title} variants={fadeUpItem} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-white/10 bg-white/12 shadow-lg shadow-black/10 backdrop-blur">
                  <step.icon size={26} />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-3xl font-bold">{step.title}</h3>
                <p className="mx-auto mt-4 max-w-xs text-lg text-white/80">
                  {step.description}
                </p>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
