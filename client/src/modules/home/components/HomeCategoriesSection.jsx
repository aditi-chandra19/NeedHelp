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
          <span className="nh-kicker">Browse by category</span>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900">
            Browse by Category
          </h2>
          <p className="mt-3 text-lg text-slate-500">
            Choose the kind of request you want to post or respond to.
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
            <Link
              key={category.label}
              to={`/browse?category=${category.slug}`}
            >
              <MotionDiv
                variants={fadeUpItem}
                whileHover={{ y: -6, scale: 1.01 }}
                className="nh-panel-soft px-4 py-8 text-center transition"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7eef6] text-[#35557e]">
                  <category.icon size={28} />
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-700">
                  {category.label}
                </p>
              </MotionDiv>
            </Link>
          ))}
        </MotionDiv>

        <div className="mt-8 text-center">
          <Link
            to="/browse"
            className="nh-button-secondary"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
