#!/usr/bin/env python3
"""Load reviews.jsonl into a SQLite reviews table (idempotent upsert on reviewId)."""

import json
import sqlite3
from pathlib import Path

HERE = Path(__file__).parent
JSONL_PATH = HERE / "reviews.jsonl"
DB_PATH = HERE / "reviews.db"

COLUMNS = [
    "reviewId",
    "rating",
    "content",
    "replyContent",
    "review_and_reply",
    "userName",
    "userImage",
    "thumbsUpCount",
    "reviewCreatedVersion",
    "appVersion",
    "at",
    "repliedAt",
    "app_id",
    "review_url",
    "requested_language",
    "requested_country",
    "collected_at",
]

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS reviews (
  reviewId              TEXT PRIMARY KEY,
  rating                INTEGER NOT NULL,
  content               TEXT NOT NULL,
  replyContent          TEXT,
  review_and_reply      TEXT,
  userName              TEXT NOT NULL,
  userImage             TEXT,
  thumbsUpCount         INTEGER NOT NULL DEFAULT 0,
  reviewCreatedVersion  TEXT,
  appVersion            TEXT,
  at                    TEXT NOT NULL,
  repliedAt             TEXT,
  app_id                TEXT NOT NULL,
  review_url            TEXT NOT NULL,
  requested_language    TEXT NOT NULL,
  requested_country     TEXT NOT NULL,
  collected_at          TEXT NOT NULL
);
"""

CREATE_INDEXES_SQL = [
    "CREATE INDEX IF NOT EXISTS idx_reviews_at ON reviews(at);",
    "CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);",
]

UPSERT_SQL = f"""
INSERT INTO reviews ({', '.join(COLUMNS)})
VALUES ({', '.join('?' for _ in COLUMNS)})
ON CONFLICT(reviewId) DO UPDATE SET
  {', '.join(f'{c} = excluded.{c}' for c in COLUMNS if c != 'reviewId')}
;
"""

BATCH_SIZE = 500


def row_from_record(record: dict) -> tuple:
    return tuple(record.get(col) for col in COLUMNS)


def main() -> None:
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute(CREATE_TABLE_SQL)
        for stmt in CREATE_INDEXES_SQL:
            conn.execute(stmt)

        batch = []
        total = 0
        with JSONL_PATH.open("r", encoding="utf-8") as f:
            with conn:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    record = json.loads(line)
                    batch.append(row_from_record(record))
                    if len(batch) >= BATCH_SIZE:
                        conn.executemany(UPSERT_SQL, batch)
                        total += len(batch)
                        batch.clear()
                if batch:
                    conn.executemany(UPSERT_SQL, batch)
                    total += len(batch)

        (count,) = conn.execute("SELECT COUNT(*) FROM reviews;").fetchone()
        (with_reply,) = conn.execute(
            "SELECT COUNT(*) FROM reviews WHERE replyContent IS NOT NULL AND replyContent != '';"
        ).fetchone()
        (without_reply,) = conn.execute(
            "SELECT COUNT(*) FROM reviews WHERE replyContent IS NULL OR replyContent = '';"
        ).fetchone()

        print(f"Processed {total} record(s) from {JSONL_PATH.name}")
        print(f"Total rows in reviews table: {count}")
        print(f"  with developer reply:    {with_reply}")
        print(f"  without developer reply: {without_reply}")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
