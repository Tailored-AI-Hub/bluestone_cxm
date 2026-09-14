import GroupedBarChart from "../components/charts/GroupedBarChart";
import { decorate, fmt } from "../lib/format";
import reviews from "../data/generated/reviews.json";
import platformStats from "../data/generated/platformStats.json";
import competitors from "../data/generated/competitors.json";

const bluestoneSent = platformStats[0].sent;

const compBrands = [{ name: "BlueStone", own: true, sent: bluestoneSent }].concat(
  competitors.slice(0, 4).map((c) => ({ name: c.name.split(" ")[0], sent: c.sent }))
);

const maxMention = Math.max(...competitors.map((c) => c.mentions), 1);
const compRanked = competitors.map((c) => ({
  name: c.name,
  mentions: c.mentions,
  pct: Math.round((c.mentions / maxMention) * 100),
  pos: c.sent.pos,
}));

const compReviews = reviews.filter((r) => r.c).map(decorate);

export default function CompetitorIntel() {
  return (
    <section>
      <h1 style={{ fontSize: 38, margin: "2px 0 4px", color: "#132434" }}>Competitor intelligence</h1>
      <p style={{ color: "#5b6672", fontSize: 15, margin: "0 0 22px" }}>
        How BlueStone is discussed relative to the brands customers name in their real reviews.
      </p>

      <div className="bs-panel" style={{ marginBottom: 22 }}>
        <h3 style={{ fontSize: 19, margin: "0 0 3px", color: "#132434" }}>Sentiment comparison — BlueStone vs competitors</h3>
        <p style={{ fontSize: 12.5, color: "#7a8593", margin: "0 0 16px" }}>Positive · neutral · negative share of mentions per brand</p>
        <GroupedBarChart brands={compBrands} />
        <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11.5, color: "#5b6672" }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22, marginBottom: 22 }}>
        <div className="bs-panel">
          <h3 style={{ fontSize: 19, margin: "0 0 18px", color: "#132434" }}>Top competitor mentions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {compRanked.map((c) => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600, color: "#132434" }}>{c.name}</span>
                  <span style={{ color: "#7a8593" }}>
                    {c.mentions} mentions · {c.pos}% pos
                  </span>
                </div>
                <div style={{ height: 10, background: "#eef2fb", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "#2563eb", width: c.pct + "%", borderRadius: 5 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bs-panel">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 19, margin: 0, color: "#132434" }}>Reviews mentioning competitors</h3>
            <span className="tag tag-neutral">{fmt(compReviews.length)} reviews</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 520, overflowY: "auto" }}>
            {compReviews.map((r, i) => (
              <div key={i} style={{ borderRadius: 14, border: "1px solid #e9edf4", padding: "15px 17px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ font: '600 14px/1 "Plus Jakarta Sans",sans-serif', color: "#132434" }}>{r.name}</span>
                  <span style={{ color: "#f0b429", fontSize: 12, letterSpacing: 1 }}>{r.stars}</span>
                  <span className="tag tag-outline" style={{ fontSize: 10, marginLeft: "auto" }}>
                    {r.compTag}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#44515f", lineHeight: 1.5 }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
