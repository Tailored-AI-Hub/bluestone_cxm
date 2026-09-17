import { useTooltip } from "../../lib/TooltipContext";
import { fmt } from "../../lib/format";

const REPLIED = "#1d4ed8";
const UNREPLIED = "#c7ddfd";
const UNREPLIED_STROKE = "#9dc0f8";
const RATING = "#f59e0b";

function niceScale(maxVal, ticks = 5) {
  if (maxVal <= 0) return { max: ticks - 1, step: 1 };
  const rawStep = maxVal / (ticks - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  let niceNorm;
  if (norm <= 1) niceNorm = 1;
  else if (norm <= 2) niceNorm = 2;
  else if (norm <= 2.5) niceNorm = 2.5;
  else if (norm <= 5) niceNorm = 5;
  else niceNorm = 10;
  const step = niceNorm * mag;
  return { max: Math.ceil(maxVal / step) * step, step };
}

// Rounds only the corners furthest from the baseline; the baseline-anchored
// end (and any edge shared with a stacked segment) stays square.
function topRoundedRectPath(x, y, w, h, r) {
  if (h <= 0) return "";
  const rr = Math.min(r, h, w / 2);
  if (rr <= 0.01) return `M${x} ${y} h${w} v${h} h${-w} Z`;
  return (
    `M${x} ${y + rr} ` +
    `a${rr} ${rr} 0 0 1 ${rr} ${-rr} ` +
    `h${w - 2 * rr} ` +
    `a${rr} ${rr} 0 0 1 ${rr} ${rr} ` +
    `v${h - rr} ` +
    `h${-w} Z`
  );
}

// Stacked bar (reviews received / replied) with an overlaid line (average
// rating) on a second, independent y-scale. Two-axis combo charts invite an
// arbitrary-looking correlation between series, so both axes are labelled
// explicitly and the legend/tooltips always restate units rather than
// leaving the reader to infer them from position alone.
export default function VolumeReplyTrend({ labels, volumes, replied, ratings }) {
  const { showTip, hideTip } = useTooltip();
  const W = 780, H = 300, pad = { l: 46, r: 54, t: 26, b: 32 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const n = labels.length;

  const volMax = Math.max(...volumes, 1);
  const { max: volTop, step: volStep } = niceScale(volMax, 5);
  const volTicks = [];
  for (let v = 0; v <= volTop + 0.0001; v += volStep) volTicks.push(Math.round(v));

  const ratingTicks = [1, 2, 3, 4, 5];
  const yVol = (v) => pad.t + (1 - v / volTop) * ih;
  const yRating = (v) => pad.t + (1 - (v - 1) / 4) * ih;

  const slot = iw / n;
  const barW = Math.min(30, slot * 0.5);
  const xCenter = (i) => pad.l + slot * (i + 0.5);
  const baseY = pad.t + ih;
  const GAP = 2;

  const linePts = ratings.map((v, i) => [xCenter(i), yRating(v)]);
  const linePath = linePts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {volTicks.map((t, i) => (
          <line key={"g" + i} x1={pad.l} x2={W - pad.r} y1={yVol(t)} y2={yVol(t)} stroke="#eceff2" strokeWidth={1} />
        ))}

        <text x={pad.l} y={14} fontSize={10} fontWeight={600} letterSpacing={0.4} fill="#9aa4b0">
          ★ AVG RATING (1–5)
        </text>
        <text x={W - pad.r} y={14} textAnchor="end" fontSize={10} fontWeight={600} letterSpacing={0.4} fill="#9aa4b0">
          REVIEWS
        </text>

        {ratingTicks.map((t, i) => (
          <text key={"lt" + i} x={pad.l - 10} y={yRating(t)} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="#9aa4b0">
            {t}
          </text>
        ))}
        {volTicks.map((t, i) => (
          <text key={"rt" + i} x={W - pad.r + 10} y={yVol(t)} textAnchor="start" dominantBaseline="middle" fontSize={10} fill="#9aa4b0">
            {fmt(t)}
          </text>
        ))}

        {volumes.map((vol, i) => {
          const rep = Math.min(replied[i] || 0, vol);
          const unrep = vol - rep;
          const x = xCenter(i) - barW / 2;
          const repY = yVol(rep);
          const totalY = yVol(vol);
          const repTop = unrep > 0 ? repY - GAP : repY;

          return (
            <g
              key={i}
              style={{ cursor: "default" }}
              onMouseMove={(e) =>
                showTip(
                  e,
                  `${labels[i]} · ${fmt(vol)} received · ${fmt(rep)} replied (${vol ? Math.round((rep / vol) * 100) : 0}%)`
                )
              }
              onMouseLeave={hideTip}
            >
              {unrep > 0 && <path d={topRoundedRectPath(x, totalY, barW, Math.max(0, repTop - totalY), 3)} fill={UNREPLIED} stroke={UNREPLIED_STROKE} strokeWidth={1} />}
              {rep > 0 && (
                <path
                  d={unrep > 0 ? `M${x} ${repY} h${barW} v${baseY - repY} h${-barW} Z` : topRoundedRectPath(x, repY, barW, baseY - repY, 3)}
                  fill={REPLIED}
                />
              )}
              {vol === 0 && <rect x={x} y={baseY - 2} width={barW} height={2} rx={1} fill="#eceff2" />}
            </g>
          );
        })}

        <path d={linePath} fill="none" stroke={RATING} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {linePts.map((p, i) => (
          <circle key={"v" + i} cx={p[0]} cy={p[1]} r={3} fill="#fff" stroke={RATING} strokeWidth={2} />
        ))}
        {linePts.map((p, i) => (
          <circle
            key={"h" + i}
            cx={p[0]}
            cy={p[1]}
            r={9}
            fill="transparent"
            style={{ cursor: "default" }}
            onMouseMove={(e) => showTip(e, `${labels[i]} · ${ratings[i].toFixed(2)}★ avg rating`)}
            onMouseLeave={hideTip}
          />
        ))}

        {labels.map((l, i) => (
          <text key={"xl" + i} x={xCenter(i)} y={H - 8} textAnchor="middle" fontSize={10} fill="#9aa4b0">
            {l}
          </text>
        ))}
      </svg>

      <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 11.5, color: "#5b6672", flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, background: REPLIED, display: "inline-block", borderRadius: 3 }} />
          Replied
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, background: UNREPLIED, border: `1px solid ${UNREPLIED_STROKE}`, display: "inline-block", borderRadius: 3 }} />
          Awaiting reply
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 14, height: 2, background: RATING, display: "inline-block", borderRadius: 2 }} />
          Avg rating
        </span>
      </div>
    </div>
  );
}
