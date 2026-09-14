import { useTooltip } from "../../lib/TooltipContext";

export default function LineTrend({ series, labels, min = 3.0, max = 5.0 }) {
  const { showTip, hideTip } = useTooltip();
  const W = 660, H = 220, pad = { l: 34, r: 24, t: 14, b: 30 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const xs = (i) => pad.l + (i / (series.length - 1)) * iw;
  const ys = (v) => pad.t + (1 - (v - min) / (max - min)) * ih;
  const pts = series.map((v, i) => [xs(i), ys(v)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L${xs(series.length - 1).toFixed(1)} ${(pad.t + ih).toFixed(1)} L${pad.l} ${(pad.t + ih).toFixed(1)} Z`;

  const gridLines = [];
  for (let g = min; g <= max + 0.001; g += (max - min) / 4) gridLines.push(g);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={pad.l} x2={W - pad.r} y1={ys(g)} y2={ys(g)} stroke="#eceff2" strokeWidth={1} />
          <text x={pad.l - 6} y={ys(g)} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="#9aa4b0">
            {g.toFixed(1)}
          </text>
        </g>
      ))}
      <path d={area} fill="rgba(47,116,255,0.12)" />
      <path d={line} fill="none" stroke="#2563eb" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={"v" + i} cx={p[0]} cy={p[1]} r={3} fill="#fff" stroke="#2563eb" strokeWidth={2} />
      ))}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={8}
          fill="transparent"
          style={{ cursor: "default" }}
          onMouseMove={(e) => showTip(e, `${labels[i]} · ${series[i].toFixed(2)}★`)}
          onMouseLeave={hideTip}
        />
      ))}
      {labels.map((l, i) => (
        <text key={i} x={xs(i)} y={H - 8} textAnchor="middle" fontSize={10} fill="#9aa4b0">
          {l}
        </text>
      ))}
    </svg>
  );
}
