"use client";
import { CONTENT_TYPES, type ContentType } from "@/lib/types";
import styles from "./TypeSelector.module.css";

interface TypeSelectorProps {
  value: ContentType;
  onChange: (v: ContentType) => void;
}

export default function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className={styles.grid}>
      {CONTENT_TYPES.map((t) => (
        <button
          key={t.id}
          className={`${styles.tile} ${value === t.id ? styles.active : ""}`}
          onClick={() => onChange(t.id)}
        >
          <span className={`${styles.label} bn`}>{t.label}</span>
          <span className={styles.desc}>{t.description}</span>
        </button>
      ))}
    </div>
  );
}
