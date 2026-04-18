"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./ResultPanel.module.css";

interface ResultPanelProps {
  results: string[];
  isLoading: boolean;
}

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied">("idle");
  const copy = () => {
    navigator.clipboard.writeText(text);
    setState("copied");
    setTimeout(() => setState("idle"), 2000);
  };
  return (
    <button className={`${styles.copyBtn} ${state === "copied" ? styles.copied : ""}`} onClick={copy}>
      {state === "copied" ? "✓ Copied" : "Copy"}
    </button>
  );
}

function SkeletonLoader() {
  return (
    <div className={styles.skeleton}>
      {[80, 95, 60, 75, 40].map((w, i) => (
        <div key={i} className={styles.skeletonLine} style={{ width: `${w}%`, animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

export default function ResultPanel({ results, isLoading }: ResultPanelProps) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => { setActiveTab(0); }, [results]);

  if (!isLoading && results.length === 0) return null;

  return (
    <div className={styles.root}>
      {results.length > 1 && (
        <div className={styles.tabs}>
          {results.map((_, i) => (
            <button
              key={i}
              className={`${styles.tab} ${activeTab === i ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(i)}
            >
              Variation {i + 1}
            </button>
          ))}
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.statusDot} />
          <span className={styles.statusLabel}>
            {isLoading ? "Generating…" : "Ready"}
          </span>
          {!isLoading && results[activeTab] && (
            <>
              <span className={styles.charCount}>{results[activeTab].length} chars</span>
              <CopyButton text={results[activeTab]} />
            </>
          )}
        </div>

        <div className={styles.cardBody}>
          {isLoading ? (
            <SkeletonLoader />
          ) : results[activeTab] ? (
            <p className="bn" style={{ whiteSpace: "pre-wrap", margin: 0 }}>
              {results[activeTab]}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
                                }
