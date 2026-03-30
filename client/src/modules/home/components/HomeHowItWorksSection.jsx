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
    <section className="bg-gradient-to-r from-slate-900 via-sky-900 to-emerald-800 px-4 py-20 text-white md:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-4xl font-black tracking-tight">
          How It Works
        </h2>

        <MotionDiv
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mt-12 grid gap-8 md:grid-cols-3"
        >
          {steps.map((step) => (
            <MotionDiv key={step.title} variants={fadeUpItem} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.75rem] bg-white/14 shadow-lg shadow-black/10 backdrop-blur">
                <step.icon size={26} />
              </div>
              <h3 className="mt-6 text-3xl font-bold">{step.title}</h3>
              <p className="mx-auto mt-4 max-w-xs text-lg text-white/80">
                {step.description}
              </p>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </section>
  );
}
