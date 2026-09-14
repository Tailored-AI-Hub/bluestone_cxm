import { useState, useMemo } from "react";
import { decorate, fmt } from "../lib/format";
import reviews from "../data/generated/reviews.json";

const PAGE_SIZE = 6;

const timeTabDefs = [
  { v: "today", l: "Today", days: 1 },
  { v: "week", l: "This week", days: 7 },
  { v: "month", l: "This month", days: 30 },
  { v: "all", l: "All time", days: null },
];

// Latest real review date stands in for "today" — the live scrape's most
// recent data point, not the system clock (which would make every tab but
// "All time" empty against this historical snapshot).
const REFERENCE_DATE = reviews.reduce((max, r) => (r.d > max ? r.d : max), reviews[0].d);

function cutoffFor(days) {
  if (days == null) return "0000-00-00";
  const ref = new Date(REFERENCE_DATE + "T00:00:00Z");
  ref.setUTCDate(ref.getUTCDate() - days);
  return ref.toISOString().slice(0, 10);
}

// With 3,000+ real reviews a full page-number row would be hundreds of
// buttons (the prototype only ever paged ~20 mock rows) — window it down
// to first/last plus a few around the current page.
function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  return [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
}

export default function ReviewsFeed() {
  const [timeTab, setTimeTab] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [star, setStar] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const cutoff = cutoffFor(timeTabDefs.find((t) => t.v === timeTab).days);
    return reviews.filter((r) => {
      if (platform !== "all" && r.p !== platform) return false;
      if (star !== "all" && r.r !== +star) return false;
      if (r.d < cutoff) return false;
      return true;
    });
  }, [timeTab, platform, star]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const paged = filtered.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE).map(decorate);

  function changeFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  return (
    <section>
      <h1 style={{ fontSize: 38, margin: "2px 0 4px", color: "#132434" }}>Reviews feed</h1>
      <p style={{ color: "#5b6672", fontSize: 15, margin: "0 0 20px" }}>
        Every collected Play Store review, filterable by time, and rating.
      </p>

      <div className="seg" style={{ marginBottom: 16, flexWrap: "wrap" }}>
        {timeTabDefs.map((t) => (
          <label key={t.v} className={"seg-opt" + (timeTab === t.v ? " active" : "")} onClick={() => changeFilter(setTimeTab, t.v)}>
            {t.l}
          </label>
        ))}
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 20 }}>
        <div className="field" style={{ minWidth: 200 }}>
          <label>Platform</label>
          <select className="input" value={platform} disabled>
            <option value="all">Play Store</option>
          </select>
        </div>
        <div className="field" style={{ minWidth: 160 }}>
          <label>Star rating</label>
          <select className="input" value={star} onChange={(e) => changeFilter(setStar, e.target.value)}>
            <option value="all">All ratings</option>
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>
                {s} star
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 13, color: "#7a8593", paddingBottom: 8 }}>
          <strong style={{ color: "#1d2d3d" }}>{fmt(filtered.length)}</strong> reviews
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {paged.map((r, i) => (
          <div key={i} className="bs-panel" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  flex: "none",
                  background: r.platColor,
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                  font: '700 13px/1 "Plus Jakarta Sans",sans-serif',
                }}
                title={r.platName}
              >
                {r.platIcon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ font: '600 15px/1 "Plus Jakarta Sans",sans-serif', color: "#132434" }}>{r.name}</span>
                  {r.verified && (
                    <span className="tag tag-accent" style={{ fontSize: 10 }}>
                      Verified
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: "#8a94a0" }}>{r.platName}</span>
                  <span style={{ color: "#f0b429", letterSpacing: 2, fontSize: 14 }}>{r.stars}</span>
                </div>
                <p style={{ margin: "9px 0 10px", fontSize: 14, color: "#33414f", lineHeight: 1.6 }}>{r.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={r.senStyle}>{r.senLabel}</span>
                  {r.compTag && (
                    <span className="tag tag-outline" style={{ fontSize: 10 }}>
                      mentions {r.compTag}
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: "#9aa4b0", marginLeft: "auto" }}>{r.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {paged.length === 0 && <div style={{ padding: 24, textAlign: "center", color: "#9aa4b0", fontSize: 13 }}>No reviews match this selection.</div>}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24 }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="btn btn-secondary" style={{ fontSize: 13 }}>
          Prev
        </button>
        {pageWindow(clampedPage, totalPages).map((n, i, arr) => (
          <span key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {i > 0 && n - arr[i - 1] > 1 && <span style={{ color: "#9aa4b0", fontSize: 13 }}>&hellip;</span>}
            <button
              onClick={() => setPage(n)}
              className={"btn btn-secondary" + (n === clampedPage ? " active" : "")}
              style={{ minWidth: 38, fontSize: 13 }}
            >
              {n}
            </button>
          </span>
        ))}
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="btn btn-secondary" style={{ fontSize: 13 }}>
          Next
        </button>
      </div>
    </section>
  );
}
