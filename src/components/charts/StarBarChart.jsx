import { fmt } from "../../lib/format";
import { useTooltip } from "../../lib/TooltipContext";

export default function StarBarChart({ stars }) {
  const { showTip, hideTip } = useTooltip();
  const labels = ["5", "4", "3", "2", "1"];
  const colors = ["#1d4ed8", "#3b82f6", "#7cb0f7", "#f6b59c", "#ef6a4a"];
  const W = 360, rowH = 24, gap = 12, barX = 44, barW = W - barX - 62;
  const max = Math.max(...stars, 1);
  const H = stars.length * (rowH + gap);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }} preserveAspectRatio="xMidYMid meet">
      {stars.map((c, i) => {
        const y = i * (rowH + gap);
        const w = Math.max(3, (c / max) * barW);
        return (
          <g
            key={i}
            style={{ cursor: "default" }}
            onMouseMove={(e) => showTip(e, `${labels[i]}★ · ${fmt(c)} reviews`)}
            onMouseLeave={hideTip}
          >
            <text x={0} y={y + rowH / 2} dominantBaseline="middle" fontSize={13} fontWeight={600} fill="#1d2d3d">
              {labels[i]}{"★"}
            </text>
            <rect x={barX} y={y} width={barW} height={rowH} rx={rowH / 2} fill="#eef2fb" />
            <rect x={barX} y={y} width={w} height={rowH} rx={rowH / 2} fill={colors[i]} />
            <text x={barX + w + 8} y={y + rowH / 2} dominantBaseline="middle" fontSize={12} fill="#5b6672">
              {fmt(c)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
