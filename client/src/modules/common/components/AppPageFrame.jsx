import { motion } from "framer-motion";
import HomeTopNav from "../../home/components/HomeTopNav.jsx";

export default function AppPageFrame({ onLogout, user, children }) {
  const MotionDiv = motion.div;

  return (
    <div className="min-h-screen text-slate-900">
      <MotionDiv
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[26rem] overflow-hidden"
      >
        <MotionDiv
          animate={{ x: [0, 16, 0], y: [0, 12, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[9%] top-16 h-56 w-56 rounded-full bg-[#d9e2ee]/60 blur-3xl"
        />
        <MotionDiv
          animate={{ x: [0, -18, 0], y: [0, 10, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-10 h-52 w-52 rounded-full bg-[#dbe7f7]/58 blur-3xl"
        />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/55 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(95,126,168,0.22)_18%,rgba(95,126,168,0.22)_82%,transparent_100%)]" />
        <div className="absolute inset-x-0 top-[6.75rem] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(23,32,51,0.08)_20%,rgba(23,32,51,0.08)_80%,transparent_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(23,32,51,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(23,32,51,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </MotionDiv>

      <MotionDiv
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-28 bg-gradient-to-t from-white/30 to-transparent"
      >
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(23,32,51,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(23,32,51,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </MotionDiv>

      <div className="relative z-[90]">
        <div className="mx-auto max-w-[96rem] px-3 pt-3 md:px-5 md:pt-4">
          <div className="nh-panel overflow-visible">
            <HomeTopNav onLogout={onLogout} user={user} />
          </div>
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
