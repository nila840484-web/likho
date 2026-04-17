"use client";
import styles from "./Header.module.css";

interface HeaderProps {
  historyCount: number;
  onHistoryToggle: () => void;
  historyOpen: boolean;
}

export default function Header({ historyCount, onHistoryToggle, historyOpen }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L9.5 5H12.5L10.5 7.5L11.5 11L7 9L2.5 11L3.5 7.5L1.5 5H4.5L7 1Z" fill="currentColor" />
          </svg>
        </div>
        <span className={styles.brandName}>Likhon AI</span>
        <span className={styles.badge}>Beta</span>
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.navBtn} ${historyOpen ? styles.active : ""}`}
          onClick={onHistoryToggle}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 8v4l3 3M3.05 11a9 9 0 1 0 .5-3" />
            <path d="M3 4v4h4" />
          </svg>
          History
          {historyCount > 0 && (
            <span className={styles.count}>{historyCount}</span>
          )}
        </button>
      </nav>
    </header>
  );
}
