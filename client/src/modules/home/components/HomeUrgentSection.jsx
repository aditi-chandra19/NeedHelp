import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import RequestCard from "../../requests/components/RequestCard.jsx";

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
            <span className="nh-kicker">
              <AlertTriangle size={14} />
              Priority requests
            </span>
            <h2 className="mt-5 flex items-center gap-3 text-4xl font-black text-slate-900">
              Urgent help needed nearby
            </h2>
            <p className="mt-3 text-lg text-slate-500">
              These requests need faster responses because the situation is time-sensitive or location-critical.
            </p>
          </div>

          <Link
            to="/browse"
            className="nh-button-secondary w-fit px-4 py-3"
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
            <RequestCard
              key={request.id}
              request={request}
            />
          ))}
        </MotionDiv>
      </div>
    </section>
  );
}
