import { useTooltip } from "../../lib/TooltipContext";

const sc = { pos: "#3b82f6", neu: "#cdd6e4", neg: "#ef6a4a" };
const lb = { pos: "Positive", neu: "Neutral", neg: "Negative" };

export default function SentimentBars({ items }) {
  const { showTip, hideTip } = useTooltip();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
      {items.map((p, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
            <span style={{ color: "#1d2d3d", fontWeight: 600 }}>{p.name}</span>
            <span style={{ color: "#7a8593" }}>{p.sent.pos}% positive</span>
          </div>
          <div style={{ display: "flex", height: 16, overflow: "hidden", borderRadius: 8 }}>
            {["pos", "neu", "neg"].map((k) => (
              <div
                key={k}
                style={{ width: p.sent[k] + "%", background: sc[k], cursor: "default" }}
                onMouseMove={(e) => showTip(e, `${p.name} · ${lb[k]} ${p.sent[k]}%`)}
                onMouseLeave={hideTip}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
