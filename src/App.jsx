import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { TooltipProvider } from "./lib/TooltipContext";
import Overview from "./views/Overview";
import ReviewsFeed from "./views/ReviewsFeed";
import Insights from "./views/Insights";
import CompetitorIntel from "./views/CompetitorIntel";
import StoreDeepDive from "./views/StoreDeepDive";
import kpis from "./data/generated/kpis.json";

const views = {
  overview: Overview,
  reviews: ReviewsFeed,
  insights: Insights,
  competitor: CompetitorIntel,
  store: StoreDeepDive,
};

export default function App() {
  const [page, setPage] = useState("overview");
  const ActiveView = views[page];

  return (
    <TooltipProvider>
      <div
        style={{
          display: "flex",
          height: "100vh",
          minHeight: 600,
          fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
          color: "#1d2d3d",
          background: "#eaeef7",
          overflow: "hidden",
        }}
      >
        <Sidebar page={page} onNavigate={setPage} totalReviews={kpis.totalReviews} />
        <main className="bs-scroll" style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "26px 34px 60px" }}>
            <ActiveView />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
