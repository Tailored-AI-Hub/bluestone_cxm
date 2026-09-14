import { useState, useMemo } from "react";
import StarBarChart from "../components/charts/StarBarChart";
import Donut from "../components/charts/Donut";
import LineTrend from "../components/charts/LineTrend";
import SentimentBars from "../components/charts/SentimentBars";
import { fmt, sevStyle } from "../lib/format";
import reviews from "../data/generated/reviews.json";
import trend from "../data/generated/trend.json";
import kpisData from "../data/generated/kpis.json";
import { insights } from "../data/insights";

const DATA_MIN = "2016-01";
const DATA_MAX = "2026-09";

const arrowSvg = (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

const emerging = insights
  .filter((i) => i.sev === "Critical")
  .slice(0, 3)
  .map((i) => ({ title: i.headline, sev: i.sev, count: i.count, cat: i.cat }));

export default function Overview() {
  const [fFrom, setFFrom] = useState(DATA_MIN);
  const [fTo, setFTo] = useState(DATA_MAX);

  const inRange = useMemo(() => reviews.filter((r) => r.d.slice(0, 7) >= fFrom && r.d.slice(0, 7) <= fTo), [fFrom, fTo]);

  const totVol = inRange.length;
  const avg = totVol ? inRange.reduce((s, r) => s + r.r, 0) / totVol : 0;
  const stars = [0, 0, 0, 0, 0];
  inRange.forEach((r) => stars[5 - r.r]++);
  const sentCounts = { pos: 0, neu: 0, neg: 0 };
  inRange.forEach((r) => sentCounts[r.s]++);
  const sentPos = totVol ? Math.round((sentCounts.pos / totVol) * 100) : 0;

  const thisMonth = kpisData.latestMonth;
  const reviewsThisMonth = reviews.filter((r) => r.d.slice(0, 7) === thisMonth).length;

  const platformStats = [{ id: "play", name: "Play Store", vol: totVol, sent: { pos: sentPos, neu: totVol ? Math.round((sentCounts.neu / totVol) * 100) : 0, neg: totVol ? Math.round((sentCounts.neg / totVol) * 100) : 0 } }];

  const kpis = [
    { label: "Total reviews", value: fmt(totVol), sub: "Play Store, selected range" },
    { label: "Average rating", value: avg.toFixed(2), sub: "out of 5.00" },
    { label: "Sentiment score", value: sentPos + "%", sub: "reviews classed positive" },
    { label: "Reviews this month", value: fmt(reviewsThisMonth), sub: `${thisMonth}` },
  ];

  const resetFilters = () => {
    setFFrom(DATA_MIN);
    setFTo(DATA_MAX);
  };

  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 6 }}>
        <div style={{ fontSize: 12, color: "#7a8593", display: "flex", alignItems: "center", gap: 8 }}>
          Workspace <span style={{ opacity: 0.5 }}>&rsaquo;</span> <span style={{ color: "#1d2d3d", fontWeight: 600 }}>Overview</span>
        </div>
        <button className="btn btn-primary">Export summary</button>
      </div>
      <h1 style={{ fontSize: 38, margin: "2px 0 4px", color: "#132434" }}>Customer feedback overview</h1>
      <p style={{ color: "#5b6672", fontSize: 15, margin: "0 0 22px" }}>
        Key findings, supporting reviews and areas to investigate across BlueStone's Play Store reviews.
      </p>

      <div className="bs-panel" style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ font: '600 13px/1 "Plus Jakarta Sans",sans-serif', letterSpacing: ".08em", textTransform: "uppercase", color: "#3b556e" }}>
            Your view
          </div>
          <button onClick={resetFilters} className="btn btn-ghost" style={{ fontSize: 12 }}>
            Reset filters
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
          <div className="field">
            <label>Review source</label>
            <select className="input" value="play" disabled>
              <option value="play">Play Store</option>
            </select>
          </div>
          <div className="field">
            <label>From</label>
            <input className="input" type="month" value={fFrom} min={DATA_MIN} max={fTo} onChange={(e) => setFFrom(e.target.value)} />
          </div>
          <div className="field">
            <label>To</label>
            <input className="input" type="month" value={fTo} min={fFrom} max={DATA_MAX} onChange={(e) => setFTo(e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: "#7a8593" }}>
          <strong style={{ color: "#1d2d3d" }}>{fmt(totVol)}</strong> reviews match this selection
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16, marginBottom: 22 }}>
        {kpis.map((k, i) => {
          const hero = i === 0;
          return (
            <div
              key={i}
              className="bs-panel"
              style={
                hero
                  ? {
                      padding: 22,
                      position: "relative",
                      overflow: "hidden",
                      border: "none",
                      color: "#fff",
                      background:
                        "radial-gradient(150px 120px at 88% 8%, rgba(255,255,255,.22), transparent 65%), linear-gradient(145deg,#3b82f6 0%,#1d4ed8 52%,#1a3aa8 100%)",
                      boxShadow: "0 20px 44px rgba(29,78,216,.38)",
                    }
                  : { padding: 22, position: "relative", overflow: "hidden" }
              }
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".01em", color: hero ? "rgba(255,255,255,.88)" : "#8a94ab" }}>
                  {k.label}
                </div>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    flex: "none",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: hero ? "rgba(255,255,255,.18)" : "#eaf1ff",
                    color: hero ? "#fff" : "#2563eb",
                  }}
                >
                  {arrowSvg}
                </span>
              </div>
              <div style={{ font: '800 42px/1 "Plus Jakarta Sans",sans-serif', letterSpacing: "-.03em", margin: "16px 0 7px", color: hero ? "#fff" : "#132038" }}>
                {k.value}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: hero ? "rgba(255,255,255,.82)" : "#9aa4b8" }}>{k.sub}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22, marginBottom: 22 }}>
        <div className="bs-panel">
          <h3 style={{ fontSize: 19, margin: "0 0 3px", color: "#132434" }}>Star rating distribution</h3>
          <p style={{ fontSize: 12.5, color: "#7a8593", margin: "0 0 18px" }}>Review count by rating, selected range</p>
          <StarBarChart stars={stars} />
        </div>
        <div className="bs-panel">
          <h3 style={{ fontSize: 19, margin: "0 0 3px", color: "#132434" }}>Review volume</h3>
          <p style={{ fontSize: 12.5, color: "#7a8593", margin: "0 0 18px" }}>Google Play is currently the only connected source</p>
          <Donut items={platformStats.map((p) => ({ name: p.name, vol: p.vol }))} />
        </div>
      </div>

      <div className="bs-panel" style={{ marginBottom: 22 }}>
        <h3 style={{ fontSize: 19, margin: "0 0 3px", color: "#132434" }}>Rating trend — last 12 months</h3>
        <p style={{ fontSize: 12.5, color: "#7a8593", margin: "0 0 16px" }}>Monthly average star rating, Play Store</p>
        <LineTrend series={trend.series} labels={trend.labels} min={1} max={5} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 22, marginBottom: 22 }}>
        <div className="bs-panel">
          <h3 style={{ fontSize: 19, margin: "0 0 3px", color: "#132434" }}>Sentiment breakdown</h3>
          <p style={{ fontSize: 12.5, color: "#7a8593", margin: "0 0 18px" }}>Positive · neutral · negative share (rating-based)</p>
          <SentimentBars items={platformStats} />
          <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 11.5, color: "#5b6672" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, background: "#3b82f6", display: "inline-block", borderRadius: 3 }} />
              Positive
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, background: "#cdd6e4", display: "inline-block", borderRadius: 3 }} />
              Neutral
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, background: "#ef6a4a", display: "inline-block", borderRadius: 3 }} />
              Negative
            </span>
          </div>
        </div>
        <div className="bs-panel">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 19, margin: 0, color: "#132434" }}>Top recurring issues</h3>
            <span className="tag tag-neutral">From real review analysis</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {emerging.map((e, i) => (
              <div key={i} style={{ borderRadius: 14, border: "1px solid #e9edf4", borderLeft: "4px solid #2563eb", padding: "15px 17px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 5 }}>
                  <div style={{ font: '600 15px/1.2 "Plus Jakarta Sans",sans-serif', color: "#132434" }}>{e.title}</div>
                  <span style={sevStyle(e.sev)}>{e.sev}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#5b6672", lineHeight: 1.5 }}>{e.cat}</div>
                <div style={{ marginTop: 8, font: '700 12px/1 "Plus Jakarta Sans",sans-serif', color: "#9a3b22" }}>
                  {fmt(e.count)} reviews support this
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
