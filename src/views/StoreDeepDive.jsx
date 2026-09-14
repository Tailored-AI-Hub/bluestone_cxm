import { useState, useMemo } from "react";
import LineTrend from "../components/charts/LineTrend";
import { decorate, fmt } from "../lib/format";
import { stores, mockStoreReviews, trendLabels } from "../data/mockStores";

const sortOptions = [
  ["high", "Highest rating"],
  ["low", "Lowest rating"],
  ["recent", "Most recent"],
  ["rel", "Relevance"],
];

export default function StoreDeepDive() {
  const [storeCity, setStoreCity] = useState("Mumbai");
  const [storeName, setStoreName] = useState("Phoenix Palladium");
  const [storeSort, setStoreSort] = useState("recent");

  const cities = useMemo(() => [...new Set(stores.map((s) => s.city))], []);
  const storesInCity = stores.filter((s) => s.city === storeCity);
  const curStore = stores.find((s) => s.city === storeCity && s.name === storeName) || storesInCity[0];

  function onCity(city) {
    const first = stores.find((s) => s.city === city);
    setStoreCity(city);
    setStoreName(first ? first.name : "");
  }

  const storeReviews = useMemo(() => {
    let list = mockStoreReviews.filter((r) => r.store === (curStore && curStore.name));
    list = list.slice().sort((a, b) => {
      if (storeSort === "high") return b.r - a.r;
      if (storeSort === "low") return a.r - b.r;
      if (storeSort === "recent") return b.d.localeCompare(a.d);
      return b.t.length - a.t.length;
    });
    return list.map(decorate);
  }, [curStore, storeSort]);

  const storeKpis = curStore
    ? [
        { label: "Average rating", value: curStore.avg.toFixed(2), sub: "out of 5.00" },
        { label: "Total reviews", value: fmt(curStore.reviews), sub: "lifetime" },
        { label: "Sentiment score", value: curStore.sent + "%", sub: "positive share" },
      ]
    : [];

  return (
    <section>
      <h1 style={{ fontSize: 38, margin: "2px 0 4px", color: "#132434" }}>Store deep dive</h1>
      <p style={{ color: "#5b6672", fontSize: 15, margin: "0 0 20px" }}>
        Drill into a single location's ratings, sentiment and reviews.
      </p>
      <div style={{ marginBottom: 20 }}>
        <span className="tag tag-neutral">Illustrative data — pending a real store/branch source</span>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 22 }}>
        <div className="field" style={{ minWidth: 200 }}>
          <label>City</label>
          <select className="input" value={storeCity} onChange={(e) => onCity(e.target.value)}>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="field" style={{ minWidth: 240 }}>
          <label>Store</label>
          <select className="input" value={storeName} onChange={(e) => setStoreName(e.target.value)}>
            {storesInCity.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 22 }}>
        {storeKpis.map((k) => (
          <div key={k.label} className="bs-panel" style={{ padding: 20 }}>
            <div style={{ fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", color: "#7a8593", fontWeight: 600 }}>{k.label}</div>
            <div style={{ font: '700 38px/1 "Plus Jakarta Sans",sans-serif', color: "#132434", margin: "10px 0 6px" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "#8a94a0" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="bs-panel" style={{ marginBottom: 22 }}>
        <h3 style={{ fontSize: 19, margin: "0 0 3px", color: "#132434" }}>Rating trend — {curStore ? curStore.name : ""}</h3>
        <p style={{ fontSize: 12.5, color: "#7a8593", margin: "0 0 16px" }}>Monthly average rating for this store</p>
        {curStore && <LineTrend series={curStore.trend} labels={trendLabels} min={3.5} max={5} />}
      </div>

      <div className="bs-panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <h3 style={{ fontSize: 19, margin: 0, color: "#132434" }}>Reviews for this store</h3>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {sortOptions.map(([v, l]) => (
              <button key={v} onClick={() => setStoreSort(v)} className={"btn btn-secondary" + (v === storeSort ? " active" : "")} style={{ fontSize: 12 }}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {storeReviews.map((r, i) => (
            <div key={i} style={{ borderRadius: 14, border: "1px solid #e9edf4", padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 7 }}>
                <span style={{ font: '600 14px/1 "Plus Jakarta Sans",sans-serif', color: "#132434" }}>{r.name}</span>
                <span style={{ color: "#f0b429", fontSize: 13, letterSpacing: 1 }}>{r.stars}</span>
                <span style={r.senStyle}>{r.senLabel}</span>
                <span style={{ fontSize: 12, color: "#9aa4b0", marginLeft: "auto" }}>{r.date}</span>
              </div>
              <div style={{ fontSize: 13.5, color: "#44515f", lineHeight: 1.55 }}>{r.text}</div>
            </div>
          ))}
          {storeReviews.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "#9aa4b0", fontSize: 13 }}>
              No text reviews captured for this store in the current window.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
