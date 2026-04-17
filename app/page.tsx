"use client";
import { useState, useCallback } from "react";
import Header from "@/components/Header";
import TypeSelector from "@/components/TypeSelector";
import OptionsBar from "@/components/OptionsBar";
import ResultPanel from "@/components/ResultPanel";
import HistoryDrawer from "@/components/HistoryDrawer";
import type {
  ContentType, Tone, Platform, Language,
  GenerateOptions, HistoryItem,
} from "@/lib/types";
import styles from "./page.module.css";

export default function Home() {
  // Form state
  const [contentType, setContentType] = useState<ContentType>("caption");
  const [tone, setTone] = useState<Tone>("casual");
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [language, setLanguage] = useState<Language>("bangla");
  const [hashtags, setHashtags] = useState(true);
  const [emoji, setEmoji] = useState(true);
  const [variations, setVariations] = useState(1);
  const [topic, setTopic] = useState("");

  // Output state
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const generate = useCallback(async () => {
    if (!topic.trim()) { setError("কোনো বিষয় লিখুন"); return; }
    setError("");
    setIsLoading(true);
    setResults([]);

    const opts: GenerateOptions = { topic, contentType, tone, platform, language, hashtags, emoji, variations };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(opts),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResults(data.results);
      setHistory((prev) => [{
        id: crypto.randomUUID(),
        topic,
        contentType,
        tone,
        results: data.results,
        createdAt: new Date(),
      }, ...prev.slice(0, 19)]);
    } catch {
      setError("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করো।");
    }
    setIsLoading(false);
  }, [topic, contentType, tone, platform, language, hashtags, emoji, variations]);

  const handleHistorySelect = (item: HistoryItem) => {
    setTopic(item.topic);
    setContentType(item.contentType);
    setTone(item.tone);
    setResults(item.results);
    setHistoryOpen(false);
  };

  return (
    <div className={styles.root}>
      <Header
        historyCount={history.length}
        onHistoryToggle={() => setHistoryOpen((v) => !v)}
        historyOpen={historyOpen}
      />

      <main className={styles.main}>
        {/* History drawer */}
        {historyOpen && (
          <div className={styles.historyWrap}>
            <HistoryDrawer
              items={history}
              onSelect={handleHistorySelect}
              onClear={() => { setHistory([]); setHistoryOpen(false); }}
            />
          </div>
        )}

        {/* Hero */}
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Bengali AI Writer</p>
          <h1 className={styles.headline}>
            বাংলায় লেখো<span className={styles.dot}>.</span>
            <br />
            <em className={styles.sub}>Professional content, instantly.</em>
          </h1>
        </div>

        {/* Generator card */}
        <div className={styles.card}>
          {/* Content type */}
          <section className={styles.section}>
            <span className={styles.sectionLabel}>Type</span>
            <TypeSelector value={contentType} onChange={setContentType} />
          </section>

          <div className={styles.divider} />

          {/* Options */}
          <section className={styles.section}>
            <OptionsBar
              tone={tone} platform={platform} language={language}
              hashtags={hashtags} emoji={emoji} variations={variations}
              onTone={setTone} onPlatform={setPlatform} onLanguage={setLanguage}
              onHashtags={setHashtags} onEmoji={setEmoji} onVariations={setVariations}
            />
          </section>

          <div className={styles.divider} />

          {/* Input */}
          <section className={styles.inputSection}>
            <textarea
              className={`${styles.textarea} bn`}
              value={topic}
              onChange={(e) => { setTopic(e.target.value); setError(""); }}
              placeholder="কোন বিষয়ে লিখতে চাও? (বাংলা বা ইংরেজিতে)"
              rows={4}
              maxLength={300}
            />
            <div className={styles.inputFooter}>
              {error && <span className={styles.error}>{error}</span>}
              <span className={styles.charCount} style={{ marginLeft: error ? 0 : "auto" }}>
                {topic.length} / 300
              </span>
            </div>
          </section>

          {/* Generate button */}
          <button
            className={`${styles.btn} ${isLoading ? styles.btnLoading : ""}`}
            onClick={generate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                {variations > 1 ? `${variations}টি variation তৈরি হচ্ছে…` : "তৈরি হচ্ছে…"}
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                কন্টেন্ট তৈরি করো
                {variations > 1 && <span className={styles.varBadge}>{variations} vars</span>}
              </>
            )}
          </button>
        </div>

        {/* Result */}
        <ResultPanel results={results} isLoading={isLoading} />

        {/* Footer */}
        <footer className={styles.footer}>
          <span>Likhon AI · Made for Bangladesh 🇧🇩</span>
          <span>Powered by Claude</span>
        </footer>
      </main>
    </div>
  );
}
