#!/usr/bin/env python3
"""Export static JSON for the React dashboard from BlueStone/reviews.db.

Re-run this whenever reviews.db is refreshed; commit the regenerated
files under src/data/generated/ since the deployed app has no DB access.
"""
import json
import re
import sqlite3
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "BlueStone" / "reviews.db"
OUT_DIR = ROOT / "src" / "data" / "generated"

COMPETITORS = [
    "Tanishq", "Kalyan Jewellers", "Kalyan Jewelers", "Malabar Gold",
    "CaratLane", "Senco", "Joyalukkas", "PC Jeweller", "Candere", "Melorra",
]


def sentiment(rating):
    if rating >= 4:
        return "pos"
    if rating == 3:
        return "neu"
    return "neg"


def find_competitor(text):
    for name in COMPETITORS:
        if re.search(re.escape(name), text, re.IGNORECASE):
            return name
    return None


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        "SELECT reviewId, rating, content, replyContent, repliedAt, "
        "userName, at FROM reviews ORDER BY at DESC"
    ).fetchall()
    conn.close()

    reviews = []
    star_hist = [0, 0, 0, 0, 0]  # index 0 = 5*, index 4 = 1*
    sent_counts = {"pos": 0, "neu": 0, "neg": 0}
    month_ratings = defaultdict(list)
    competitor_counts = defaultdict(list)  # name -> list of ratings
    max_month = None

    for row in rows:
        rating = row["rating"]
        s = sentiment(rating)
        text = row["content"] or ""
        competitor = find_competitor(text)
        date = row["at"][:10]
        month = date[:7]

        reviews.append({
            "id": row["reviewId"],
            "name": row["userName"],
            "p": "play",
            "r": rating,
            "d": date,
            "s": s,
            "t": text,
            "reply": row["replyContent"] if row["repliedAt"] else None,
            "c": competitor,
        })

        star_hist[5 - rating] += 1
        sent_counts[s] += 1
        month_ratings[month].append(rating)
        if max_month is None or month > max_month:
            max_month = month
        if competitor:
            competitor_counts[competitor].append(rating)

    total = len(reviews)
    avg = sum(r["r"] for r in reviews) / total

    platform_stats = [{
        "id": "play",
        "name": "Play Store",
        "vol": total,
        "avg": round(avg, 2),
        "stars": star_hist,
        "sent": {k: round(v / total * 100) for k, v in sent_counts.items()},
    }]

    MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    months_sorted = sorted(month_ratings.keys())[-12:]
    trend_labels = [
        f"{MONTH_ABBR[int(m[5:7]) - 1]} '{m[2:4]}" for m in months_sorted
    ]
    trend_series = [
        round(sum(month_ratings[m]) / len(month_ratings[m]), 2)
        for m in months_sorted
    ]

    competitors = []
    for name, ratings in competitor_counts.items():
        n = len(ratings)
        sents = [sentiment(r) for r in ratings]
        competitors.append({
            "name": name,
            "mentions": n,
            "sent": {
                k: round(sents.count(k) / n * 100)
                for k in ("pos", "neu", "neg")
            },
        })
    competitors.sort(key=lambda c: -c["mentions"])

    kpis = {
        "totalReviews": total,
        "avgRating": round(avg, 2),
        "sentimentScore": round(sent_counts["pos"] / total * 100),
        "reviewsThisMonth": len(month_ratings.get(max_month, [])),
        "latestMonth": max_month,
    }

    (OUT_DIR / "reviews.json").write_text(json.dumps(reviews, indent=2))
    (OUT_DIR / "platformStats.json").write_text(json.dumps(platform_stats, indent=2))
    (OUT_DIR / "trend.json").write_text(json.dumps(
        {"labels": trend_labels, "series": trend_series}, indent=2))
    (OUT_DIR / "competitors.json").write_text(json.dumps(competitors, indent=2))
    (OUT_DIR / "kpis.json").write_text(json.dumps(kpis, indent=2))

    print(f"Exported {total} reviews, avg={avg:.2f}, "
          f"latest month={max_month} ({kpis['reviewsThisMonth']} reviews), "
          f"{len(competitors)} competitors mentioned")


if __name__ == "__main__":
    main()
