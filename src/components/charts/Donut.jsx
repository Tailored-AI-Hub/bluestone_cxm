import { fmt } from "../../lib/format";
import { useTooltip } from "../../lib/TooltipContext";

function arc(cx, cy, ro, ri, a1, a2) {
  const pt = (r, a) => {
    const rad = (a * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const large = a2 - a1 > 180 ? 1 : 0;
  const [x1, y1] = pt(ro, a1), [x2, y2] = pt(ro, a2), [x3, y3] = pt(ri, a2), [x4, y4] = pt(ri, a1);
  return `M${x1} ${y1} A${ro} ${ro} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${ri} ${ri} 0 ${large} 0 ${x4} ${y4} Z`;
}

export default function Donut({ items }) {
  const { showTip, hideTip } = useTooltip();
  const total = items.reduce((s, p) => s + p.vol, 0);
  const cx = 90, cy = 90;
  const colors = ["#1e3a8a", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#a9c9ff"];
  let a = -90;
  // A single 100%-share item makes a1===a2 after a full 360° sweep, which
  // produces a degenerate (invisible) SVG arc path — draw a plain ring instead.
  const arcs =
    items.length === 1
      ? [
          <g
            key={0}
            style={{ cursor: "default" }}
            onMouseMove={(e) => showTip(e, `${items[0].name} · ${fmt(items[0].vol)} (100%)`)}
            onMouseLeave={hideTip}
          >
            <circle cx={cx} cy={cy} r={60} fill="none" stroke={colors[0]} strokeWidth={28} />
          </g>,
        ]
      : items.map((p, i) => {
          const frac = p.vol / total;
          const a2 = a + frac * 360;
          const seg = arc(cx, cy, 74, 46, a, a2);
          a = a2;
          return (
            <path
              key={i}
              d={seg}
              fill={colors[i % colors.length]}
              style={{ cursor: "default" }}
              onMouseMove={(e) => showTip(e, `${p.name} · ${fmt(p.vol)} (${Math.round(frac * 100)}%)`)}
              onMouseLeave={hideTip}
            />
          );
        });

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
      <svg viewBox="0 0 180 180" style={{ width: 168, height: 168, flex: "none" }}>
        {arcs}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={26} fontWeight={700} fill="#1d2d3d" fontFamily="Plus Jakarta Sans">
          {fmt(total)}
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" fontSize={10} letterSpacing={1} fill="#7a8593">
          REVIEWS
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1, minWidth: 160 }}>
        {items.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}>
            <span style={{ width: 11, height: 11, background: colors[i % colors.length], flex: "none", borderRadius: 3 }} />
            <span style={{ color: "#1d2d3d", flex: 1 }}>{p.name}</span>
            <span style={{ color: "#7a8593", fontWeight: 600 }}>{fmt(p.vol)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
