import { motion } from "framer-motion";
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

export default function HomeCategoriesSection({ categories }) {
  const MotionDiv = motion.div;

  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">
            Browse by Category
          </h2>
          <p className="mt-3 text-lg text-slate-500">
            Choose what kind of help you need
          </p>
        </div>

        <MotionDiv
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          variants={containerVariants}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5"
        >
          {categories.map((category) => (
            <MotionDiv
              key={category.label}
              variants={fadeUpItem}
              whileHover={{ y: -6, scale: 1.01 }}
              className="rounded-[1.75rem] border border-slate-200 bg-white px-4 py-8 text-center shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-sky-700">
                <category.icon size={28} />
              </div>
              <p className="mt-5 text-sm font-semibold text-slate-700">
                {category.label}
              </p>
            </MotionDiv>
          ))}
        </MotionDiv>

        <div className="mt-8 text-center">
          <Link
            to="/browse"
            className="inline-flex rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
