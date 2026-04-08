import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearStoredSession, getStoredSession } from "../../auth/services/session.js";
import AppPageFrame from "../../common/components/AppPageFrame.jsx";
import HomeHeroSection from "../components/HomeHeroSection.jsx";
import HomeUrgentSection from "../components/HomeUrgentSection.jsx";
import HomeCategoriesSection from "../components/HomeCategoriesSection.jsx";
import HomeHowItWorksSection from "../components/HomeHowItWorksSection.jsx";
import HomeTrustSection from "../components/HomeTrustSection.jsx";
import { fetchRequests } from "../../requests/services/requestService.js";
import {
  heroStats as heroStatsTemplate,
  steps,
  trustFeatures,
  trustStats,
} from "../content/homeContent.js";

export default function HomePage() {
  const navigate = useNavigate();
  const session = getStoredSession();
  const user = session?.user;
  const [searchQuery, setSearchQuery] = useState("");
  const [requestFeed, setRequestFeed] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);

  const personalizedTitle = useMemo(() => {
    if (!user?.name) {
      return "Need help? Or want to help?";
    }

    const firstName = user.name.split(" ")[0];
    return `Welcome ${firstName}, need help or want to help?`;
  }, [user?.name]);

  const heroStats = useMemo(
    () => [
      {
        ...heroStatsTemplate[0],
        value: summary?.activeUsers || heroStatsTemplate[0].value,
      },
      {
        ...heroStatsTemplate[1],
        value: summary?.tasksCompleted || heroStatsTemplate[1].value,
      },
      {
        ...heroStatsTemplate[2],
        value: summary?.averageResponse || heroStatsTemplate[2].value,
      },
      {
        ...heroStatsTemplate[3],
        value: summary?.verifiedHelpers || heroStatsTemplate[3].value,
      },
    ],
    [summary]
  );

  const urgentRequests = useMemo(() => requestFeed.slice(0, 3), [requestFeed]);
  const featuredCategories = useMemo(() => categories.slice(0, 10), [categories]);

  useEffect(() => {
    let isActive = true;

    async function loadHomeFeed() {
      try {
        const payload = await fetchRequests();

        if (!isActive) {
          return;
        }

        setRequestFeed(payload.requests);
        setCategories(payload.categories.filter((item) => item.count > 0));
        setSummary(payload.summary);
      } catch {
        if (!isActive) {
          return;
        }

        setRequestFeed([]);
        setCategories([]);
      }
    }

    loadHomeFeed();

    return () => {
      isActive = false;
    };
  }, []);

  function handleLogout() {
    clearStoredSession();
    navigate("/login", { replace: true });
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      navigate(`/browse?q=${encodeURIComponent(trimmedQuery)}`);
      return;
    }

    navigate("/browse");
  }

  return (
    <AppPageFrame onLogout={handleLogout} user={user}>
      <main>
        <HomeHeroSection
          title={personalizedTitle}
          searchQuery={searchQuery}
          onSearchChange={(event) => setSearchQuery(event.target.value)}
          onSearchSubmit={handleSearchSubmit}
          heroStats={heroStats}
        />
        <HomeUrgentSection urgentRequests={urgentRequests} />
        <HomeCategoriesSection categories={featuredCategories} />
        <HomeHowItWorksSection steps={steps} />
        <HomeTrustSection trustFeatures={trustFeatures} trustStats={trustStats} />
      </main>
    </AppPageFrame>
  );
}
