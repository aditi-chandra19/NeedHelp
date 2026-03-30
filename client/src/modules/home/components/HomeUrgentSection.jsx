import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import UrgentRequestCard from "./UrgentRequestCard.jsx";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function HomeUrgentSection({ urgentRequests }) {
  const MotionDiv = motion.div;

  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="flex items-center gap-3 text-4xl font-black text-red-600">
              <AlertTriangle size={34} />
              Urgent Help Needed
            </h2>
            <p className="mt-2 text-lg text-slate-500">
              People nearby need your help right now
            </p>
          </div>

          <Link
            to="/browse"
            className="inline-flex w-fit rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            View All
          </Link>
        </div>

        <MotionDiv
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          variants={containerVariants}
          className="grid gap-6 xl:grid-cols-3"
        >
          {urgentRequests.map((request) => (
            <UrgentRequestCard key={request.id} request={request} />
          ))}
        </MotionDiv>
      </div>
    </section>
  );
}
