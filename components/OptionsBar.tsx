"use client";
import { TONES, PLATFORMS, LANGUAGES, type Tone, type Platform, type Language } from "@/lib/types";
import styles from "./OptionsBar.module.css";

interface OptionsBarProps {
  tone: Tone;
  platform: Platform;
  language: Language;
  hashtags: boolean;
  emoji: boolean;
  variations: number;
  onTone: (v: Tone) => void;
  onPlatform: (v: Platform) => void;
  onLanguage: (v: Language) => void;
  onHashtags: (v: boolean) => void;
  onEmoji: (v: boolean) => void;
  onVariations: (v: number) => void;
}

function Pill<T extends string>({
  items, value, onChange, colorClass,
}: {
  items: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  colorClass?: string;
}) {
  return (
    <div className={styles.pillRow}>
      {items.map((item) => (
        <button
          key={item.id}
          className={`${styles.pill} ${value === item.id ? `${styles.pillActive} ${colorClass ?? ""}` : ""}`}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className={`${styles.toggle} ${value ? styles.toggleOn : ""}`} onClick={() => onChange(!value)}>
      <span className={styles.toggleTrack}>
        <span className={styles.toggleThumb} />
      </span>
      {label}
    </button>
  );
}

export default function OptionsBar(props: OptionsBarProps) {
  return (
    <div className={styles.root}>
      {/* Row 1 */}
      <div className={styles.row}>
        <div className={styles.group}>
          <span className={styles.groupLabel}>Tone</span>
          <Pill items={TONES} value={props.tone} onChange={props.onTone} />
        </div>
      </div>

      {/* Row 2 */}
      <div className={styles.row}>
        <div className={styles.group}>
          <span className={styles.groupLabel}>Platform</span>
          <Pill items={PLATFORMS} value={props.platform} onChange={props.onPlatform} />
        </div>
      </div>

      {/* Row 3 */}
      <div className={styles.row}>
        <div className={styles.group}>
          <span className={styles.groupLabel}>Language</span>
          <Pill items={LANGUAGES} value={props.language} onChange={props.onLanguage} />
        </div>

        <div className={styles.divider} />

        <div className={styles.toggleGroup}>
          <Toggle label="Hashtag" value={props.hashtags} onChange={props.onHashtags} />
          <Toggle label="Emoji" value={props.emoji} onChange={props.onEmoji} />
        </div>

        <div className={styles.divider} />

        <div className={styles.varGroup}>
          <span className={styles.groupLabel}>Variations</span>
          <div className={styles.varBtns}>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`${styles.varBtn} ${props.variations === n ? styles.varBtnActive : ""}`}
                onClick={() => props.onVariations(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
