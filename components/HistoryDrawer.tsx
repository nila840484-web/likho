"use client";
import type { HistoryItem } from "@/lib/types";
import styles from "./HistoryDrawer.module.css";

interface HistoryDrawerProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

function timeAgo(date: Date): string {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
}

export default function HistoryDrawer({ items, onSelect, onClear }: HistoryDrawerProps) {
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
          <path d="M12 8v4l3 3M3.05 11a9 9 0 1 0 .5-3" /><path d="M3 4v4h4" />
        </svg>
        <span>No history yet</span>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.title}>Recent</span>
        <button className={styles.clearBtn} onClick={onClear}>Clear all</button>
      </div>
      <div className={styles.list}>
        {items.map((item) => (
          <button key={item.id} className={styles.item} onClick={() => onSelect(item)}>
            <div className={styles.itemTop}>
              <span className={`${styles.itemTopic} bn`}>{item.topic.slice(0, 48)}{item.topic.length > 48 ? "…" : ""}</span>
              <span className={styles.itemTime}>{timeAgo(item.createdAt)}</span>
            </div>
            <div className={styles.itemMeta}>
              <span className={styles.tag}>{item.contentType}</span>
              <span className={styles.tag}>{item.tone}</span>
              {item.results.length > 1 && <span className={styles.tag}>{item.results.length} vars</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
