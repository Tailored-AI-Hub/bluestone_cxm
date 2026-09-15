import { useState } from "react";
import { decorate, sevStyle } from "../lib/format";
import { insights } from "../data/insights";

const categories = ["Product", "Store", "App", "Customer Support", "Delivery & Logistics", "Brand Perception"];
const tabs = ["All", ...categories];

export default function Insights() {
  const [cat, setCat] = useState("All");
  const [expanded, setExpanded] = useState({});

  const catInsights = cat === "All" ? insights : insights.filter((i) => i.cat === cat);

  function toggle(key) {
    setExpanded((s) => ({ ...s, [key]: !s[key] }));
  }

  return (
    <section>
      <h1 style={{ fontSize: 38, margin: "2px 0 4px", color: "#132434" }}>Insights</h1>
      <p style={{ color: "#5b6672", fontSize: 15, margin: "0 0 20px" }}>
        Synthesised findings grouped by theme, each backed by real reviews that support it.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
        {tabs.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={"btn btn-secondary" + (c === cat ? " active" : "")} style={{ fontSize: 13 }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {catInsights.map((ins, idx) => {
          const key = cat + idx;
          const open = !!expanded[key];
          return (
            <div key={key} className="bs-panel" style={{ padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
                <h3 style={{ fontSize: 20, margin: 0, color: "#132434", lineHeight: 1.25, flex: 1 }}>{ins.headline}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "none" }}>
                  {cat === "All" && (
                    <span className="tag tag-outline" style={{ fontSize: 10 }}>
                      {ins.cat}
                    </span>
                  )}
                  <span style={sevStyle(ins.sev)}>{ins.sev}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
                <span style={{ fontSize: 13, color: "#5b6672" }}>
                  <strong style={{ color: "#132434" }}>{ins.count} reviews</strong> support this
                </span>
                <button onClick={() => toggle(key)} className="btn btn-ghost" style={{ fontSize: 12, marginLeft: "auto" }}>
                  {open ? "Hide citations" : "Show citations"}
                </button>
              </div>
              {open && (
                <div style={{ marginTop: 16, borderTop: "1px solid #eceff2", paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  {ins.snips.map((s, i) => {
                    const d = decorate({ ...s, d: "", v: false });
                    return (
                      <div key={i} style={{ borderLeft: "2px solid #cdd6df", padding: "2px 0 2px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              flex: "none",
                              background: d.platColor,
                              color: "#fff",
                              display: "grid",
                              placeItems: "center",
                              font: '700 10px/1 "Plus Jakarta Sans",sans-serif',
                            }}
                          >
                            {d.platIcon}
                          </div>
                          <span style={{ font: '600 13px/1 "Plus Jakarta Sans",sans-serif', color: "#132434" }}>{d.name}</span>
                          <span style={{ color: "#f0b429", fontSize: 12, letterSpacing: 1 }}>{d.stars}</span>
                        </div>
                        <div style={{ fontSize: 13.5, color: "#44515f", lineHeight: 1.55, fontStyle: "italic" }}>&ldquo;{d.text}&rdquo;</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {catInsights.length === 0 && <div style={{ padding: 24, textAlign: "center", color: "#9aa4b0", fontSize: 13 }}>No insights recorded for this category yet.</div>}
      </div>
    </section>
  );
}
