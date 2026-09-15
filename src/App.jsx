import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { TooltipProvider } from "./lib/TooltipContext";
import Overview from "./views/Overview";
import ReviewsFeed from "./views/ReviewsFeed";
import Insights from "./views/Insights";
import CompetitorIntel from "./views/CompetitorIntel";
import StoreDeepDive from "./views/StoreDeepDive";
import kpis from "./data/generated/kpis.json";
import useIsMobile from "./lib/useIsMobile";

const views = {
  overview: Overview,
  reviews: ReviewsFeed,
  insights: Insights,
  competitor: CompetitorIntel,
  store: StoreDeepDive,
};

function MobileAppBar({ onMenu }) {
  return (
    <div className="bs-appbar">
      <button className="bs-appbar-burger" onClick={onMenu} title="Open menu">
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#16233c" strokeWidth={2.4} strokeLinecap="round">
          <line x1={3} y1={6} x2={21} y2={6} />
          <line x1={3} y1={12} x2={21} y2={12} />
          <line x1={3} y1={18} x2={21} y2={18} />
        </svg>
      </button>
      <div className="bs-appbar-brand">
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: "linear-gradient(140deg,#16233c,#243b63)",
            display: "grid",
            placeItems: "center",
            font: '800 12px/1 "Plus Jakarta Sans",sans-serif',
            color: "#fff",
            flex: "none",
          }}
        >
          BS
        </span>
        BLUESTONE
      </div>
      <button className="btn btn-primary" style={{ marginLeft: "auto" }}>
        Export
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();
  const ActiveView = views[page];

  return (
    <TooltipProvider>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: "100vh",
          minHeight: 600,
          fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
          color: "#1d2d3d",
          background: "#eaeef7",
          overflow: "hidden",
        }}
      >
        <Sidebar
          page={page}
          onNavigate={(p) => {
            setPage(p);
            setMobileNavOpen(false);
          }}
          totalReviews={kpis.totalReviews}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
          mobile={isMobile}
          drawerOpen={mobileNavOpen}
          onCloseDrawer={() => setMobileNavOpen(false)}
        />
        {isMobile && <MobileAppBar onMenu={() => setMobileNavOpen(true)} />}
        <main className="bs-scroll" style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          <div className="bs-maincontent" style={{ maxWidth: 1240, margin: "0 auto", padding: "26px 34px 60px" }}>
            <ActiveView />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
