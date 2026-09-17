export function fmt(n) {
  return n.toLocaleString("en-IN");
}

export function prettyDate(d) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  const mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${mo[+m - 1]} ${y}`;
}

export const platMeta = {
  gmaps: { s: "G", c: "#4285F4" },
  play: { s: "▶", c: "#00A25B" },
  appstore: { s: "", c: "#0A84FF" },
  instagram: { s: "IG", c: "#C13584" },
  twitter: { s: "\u{1D54F}", c: "#111" },
  mouthshut: { s: "M", c: "#E8622C" },
};

export const platformNames = {
  gmaps: "Google Maps",
  play: "Play Store",
  appstore: "App Store",
  instagram: "Instagram",
  twitter: "Twitter / X",
  mouthshut: "MouthShut",
};

const sevColors = {
  Critical: { bg: "#fbe9e4", fg: "#9a3b22" },
  High: { bg: "#fef3e6", fg: "#a35a13" },
  Medium: { bg: "#eef2fb", fg: "#3b556e" },
};

export function sevStyle(sev) {
  const c = sevColors[sev] || sevColors.Medium;
  return {
    background: c.bg,
    color: c.fg,
    font: '700 10px/1 "Plus Jakarta Sans",sans-serif',
    letterSpacing: ".08em",
    textTransform: "uppercase",
    padding: "5px 9px",
    borderRadius: 6,
  };
}

const senMap = {
  pos: { label: "Positive", bg: "#eaf1f7", fg: "#2c455d" },
  neu: { label: "Neutral", bg: "#f0f1f3", fg: "#5b6672" },
  neg: { label: "Negative", bg: "#fbe9e4", fg: "#9a3b22" },
};

// Mirrors the prototype's decorate(): computes all display-derived fields
// for a raw review record ({ name, p, r, d, s, v, t, c, ... }).
export function decorate(r) {
  const meta = platMeta[r.p] || { s: "?", c: "#888" };
  const platName = platformNames[r.p] || "";
  const sen = senMap[r.s] || senMap.neu;
  return {
    id: r.id,
    name: r.name,
    text: r.t,
    date: r.d ? prettyDate(r.d) : "",
    verified: r.v,
    platName,
    platIcon: meta.s,
    platColor: meta.c,
    stars: "★".repeat(r.r) + "☆".repeat(5 - r.r),
    rating: r.r,
    senLabel: sen.label,
    senStyle: {
      background: sen.bg,
      color: sen.fg,
      font: '600 11px/1 "Plus Jakarta Sans",sans-serif',
      letterSpacing: ".04em",
      padding: "4px 9px",
      borderRadius: 6,
    },
    compTag: r.c || "",
    reply: r.reply || "",
  };
}
