import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { clearStoredSession, getStoredSession } from "../../auth/services/session.js";
import HomeTopNav from "../components/HomeTopNav.jsx";
import HomeHeroSection from "../components/HomeHeroSection.jsx";
import HomeUrgentSection from "../components/HomeUrgentSection.jsx";
import HomeCategoriesSection from "../components/HomeCategoriesSection.jsx";
import HomeHowItWorksSection from "../components/HomeHowItWorksSection.jsx";
import HomeTrustSection from "../components/HomeTrustSection.jsx";
import {
  categories,
  heroStats,
  steps,
  trustFeatures,
  trustStats,
  urgentRequests,
} from "../content/homeContent.js";

export default function HomePage() {
  const MotionDiv = motion.div;
  const navigate = useNavigate();
  const session = getStoredSession();
  const user = session?.user;
  const [searchQuery, setSearchQuery] = useState("");

  const personalizedTitle = useMemo(() => {
    if (!user?.name) {
      return "Need help? Or want to help?";
    }

    const firstName = user.name.split(" ")[0];
    return `Welcome ${firstName}, need help or want to help?`;
  }, [user?.name]);

  function handleLogout() {
    clearStoredSession();
    navigate("/login", { replace: true });
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    navigate("/browse");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(129,140,248,0.12),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_42%,_#f8fafc_100%)] text-slate-900">
      <MotionDiv
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[22rem] overflow-hidden"
      >
        <MotionDiv
          animate={{ x: [0, 20, 0], y: [0, 18, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] top-14 h-44 w-44 rounded-full bg-sky-200/35 blur-3xl"
        />
        <MotionDiv
          animate={{ x: [0, -24, 0], y: [0, 14, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-12 h-52 w-52 rounded-full bg-indigo-200/30 blur-3xl"
        />
      </MotionDiv>

      <div className="relative z-10">
        <HomeTopNav onLogout={handleLogout} />

        <main>
          <HomeHeroSection
            title={personalizedTitle}
            searchQuery={searchQuery}
            onSearchChange={(event) => setSearchQuery(event.target.value)}
            onSearchSubmit={handleSearchSubmit}
            heroStats={heroStats}
          />
          <HomeUrgentSection urgentRequests={urgentRequests} />
          <HomeCategoriesSection categories={categories} />
          <HomeHowItWorksSection steps={steps} />
          <HomeTrustSection trustFeatures={trustFeatures} trustStats={trustStats} />
        </main>
      </div>
    </div>
  );
}
