import NavIcon from "./NavIcon";
import { fmt } from "../lib/format";
import logo from "../assets/bluestone-logo.webp";

const navA = [
  { id: "overview", label: "Overview" },
  { id: "reviews", label: "Reviews feed" },
  { id: "insights", label: "Insights" },
];
const navB = [
  { id: "competitor", label: "Competitor intel" },
  { id: "store", label: "Store deep dive" },
];

function NavButton({ item, page, onGo, collapsed }) {
  const active = page === item.id;
  return (
    <button
      onClick={() => onGo(item.id)}
      title={collapsed ? item.label : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: 11,
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        border: "none",
        font: '600 14px/1.2 "Plus Jakarta Sans",sans-serif',
        letterSpacing: "-.01em",
        padding: collapsed ? "11px 0" : "11px 13px",
        borderRadius: 13,
        marginBottom: 4,
        color: active ? "#fff" : "rgba(255,255,255,.64)",
        background: active ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "transparent",
        boxShadow: active ? "0 10px 22px rgba(37,99,235,.4)" : "none",
      }}
    >
      <span style={{ display: "flex", flex: "none" }}>
        <NavIcon id={item.id} />
      </span>
      {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
    </button>
  );
}

function ChevronIcon({ collapsed }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="butt" strokeLinejoin="round" style={{ display: "block", transform: collapsed ? "rotate(180deg)" : "none" }}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export default function Sidebar({ page, onNavigate, totalReviews, collapsed, onToggleCollapsed }) {
  return (
    <div style={{ position: "relative", flex: "none", display: "flex" }}>
      <aside
        className="bs-scroll"
        style={{
          width: collapsed ? 76 : 246,
          flex: "none",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: collapsed ? "22px 10px" : "22px 16px",
          overflowY: "auto",
          overflowX: "hidden",
          transition: "width .18s ease, padding .18s ease",
          backgroundImage: `linear-gradient(180deg,rgba(15,28,42,.72) 0%,rgba(15,28,42,.9) 40%,rgba(12,22,34,.97) 100%), url(${logo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div style={{ padding: "2px 4px 18px" }}>
          {collapsed ? (
            <div
              style={{
                width: 34,
                height: 34,
                margin: "0 auto",
                borderRadius: 9,
                background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                display: "grid",
                placeItems: "center",
                font: '700 13px/1 "Plus Jakarta Sans",sans-serif',
                color: "#fff",
              }}
            >
              BS
            </div>
          ) : (
            <>
              <img src={logo} alt="BlueStone" style={{ width: "100%", height: "auto", display: "block", borderRadius: 4 }} />
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", marginTop: 8, paddingLeft: 4 }}>Voice of Customer</div>
            </>
          )}
        </div>

        {!collapsed && (
          <div style={{ font: '700 10px/1 "Plus Jakarta Sans",sans-serif', letterSpacing: ".14em", color: "rgba(255,255,255,.4)", padding: "6px 8px 10px" }}>
            REVIEW INTELLIGENCE
          </div>
        )}
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {navA.map((n) => (
            <NavButton key={n.id} item={n} page={page} onGo={onNavigate} collapsed={collapsed} />
          ))}
        </nav>

        {!collapsed && (
          <div style={{ font: '700 10px/1 "Plus Jakarta Sans",sans-serif', letterSpacing: ".14em", color: "rgba(255,255,255,.4)", padding: "20px 8px 10px" }}>
            GO DEEPER
          </div>
        )}
        <nav style={{ display: "flex", flexDirection: "column", marginTop: collapsed ? 8 : 0 }}>
          {navB.map((n) => (
            <NavButton key={n.id} item={n} page={page} onGo={onNavigate} collapsed={collapsed} />
          ))}
        </nav>

        {!collapsed && (
          <div style={{ marginTop: "auto", padding: "18px 8px 0", borderTop: "1px solid rgba(255,255,255,.1)" }}>
            <div style={{ font: '600 12px/1 "Plus Jakarta Sans",sans-serif', letterSpacing: ".04em", color: "rgba(255,255,255,.85)" }}>
              Review snapshot
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 6, lineHeight: 1.6 }}>
              Real Play Store reviews {"·"} {fmt(totalReviews)} total
            </div>
          </div>
        )}
      </aside>

      <button
        onClick={onToggleCollapsed}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          position: "absolute",
          top: 28,
          right: -13,
          width: 26,
          height: 26,
          borderRadius: "50%",
          border: "1px solid #dbe2ea",
          background: "#fff",
          color: "#44515f",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(15,28,42,.18)",
          zIndex: 5,
        }}
      >
        <ChevronIcon collapsed={collapsed} />
      </button>
    </div>
  );
}
