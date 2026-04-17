"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./ResultPanel.module.css";

interface ResultPanelProps {
  results: string[];
  isLoading: boolean;
}

function useTypewriter(text: string, speed = 16) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef(0);
  const prev = useRef("");

  useEffect(() => {
    if (text === prev.current) return;
    prev.current = text;
    setDisplayed("");
    setDone(false);
    ref.current = 0;
    if (!text) return;
    const id = setInterval(() => {
      ref.current++;
      setDisplayed(text.slice(0, ref.current));
      if (ref.current >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

function TypewriterContent({ text }: { text: string }) {
  const { displayed, done } = useTypewriter(text);
  return (
    <span className="bn">
      {displayed}
      {!done && <span className={styles.cursor}>|</span>}
    </span>
  );
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
      {state === "copied" ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
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
    <div className={`${styles.root} animate-fade-up`}>
      {/* Tab bar */}
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

      {/* Content */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.statusDot} />
          <span className={styles.statusLabel}>
            {isLoading ? "Generating…" : "Ready"}
          </span>
          {!isLoading && results[activeTab] && (
            <span className={styles.charCount}>{results[activeTab].length} chars</span>
          )}
          {!isLoading && results[activeTab] && (
            <CopyButton text={results[activeTab]} />
          )}
        </div>

        <div className={styles.cardBody}>
          {isLoading ? (
            <SkeletonLoader />
          ) : results[activeTab] ? (
            <TypewriterContent text={results[activeTab]} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
