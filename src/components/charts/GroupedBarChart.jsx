import { useTooltip } from "../../lib/TooltipContext";

const keys = [
  ["pos", "#3b82f6", "Positive"],
  ["neu", "#cdd6e4", "Neutral"],
  ["neg", "#ef6a4a", "Negative"],
];

export default function GroupedBarChart({ brands }) {
  const { showTip, hideTip } = useTooltip();
  const W = 660, H = 250, pad = { l: 32, r: 12, t: 14, b: 42 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const gw = iw / brands.length, bw = gw / 4.5;
  const ys = (v) => pad.t + (1 - v / 100) * ih;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {[0, 25, 50, 75, 100].map((g, i) => (
        <g key={i}>
          <line x1={pad.l} x2={W - pad.r} y1={ys(g)} y2={ys(g)} stroke="#eceff2" />
          <text x={pad.l - 6} y={ys(g)} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="#9aa4b0">
            {g}
          </text>
        </g>
      ))}
      {brands.map((b, i) => {
        const gx = pad.l + i * gw + gw / 2;
        return (
          <g key={i}>
            {keys.map(([k, c, lab], j) => {
              const bh = (b.sent[k] / 100) * ih;
              const x = gx - bw * 1.5 + j * bw;
              return (
                <rect
                  key={k}
                  x={x}
                  y={pad.t + ih - bh}
                  width={bw - 3}
                  height={bh}
                  rx={3}
                  fill={c}
                  style={{ cursor: "default" }}
                  onMouseMove={(e) => showTip(e, `${b.name} · ${lab} ${b.sent[k]}%`)}
                  onMouseLeave={hideTip}
                />
              );
            })}
            <text x={gx} y={H - pad.b + 16} textAnchor="middle" fontSize={11} fill={b.own ? "#1d2d3d" : "#5b6672"} fontWeight={b.own ? 700 : 400}>
              {b.name}
            </text>
            {b.own && (
              <text x={gx} y={H - pad.b + 30} textAnchor="middle" fontSize={9} letterSpacing={0.5} fill="#2563eb" fontWeight={700}>
                YOU
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
