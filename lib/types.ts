export type ContentType = "caption" | "post" | "story" | "bio" | "quote" | "ad" | "thread";
export type Tone = "casual" | "emotional" | "formal" | "funny" | "motivational" | "poetic" | "professional";
export type Platform = "facebook" | "instagram" | "tiktok" | "youtube" | "linkedin" | "twitter";
export type Language = "bangla" | "banglish" | "mixed" | "english";

export interface GenerateOptions {
  topic: string;
  contentType: ContentType;
  tone: Tone;
  platform: Platform;
  language: Language;
  hashtags: boolean;
  emoji: boolean;
  variations: number;
}

export interface HistoryItem {
  id: string;
  topic: string;
  contentType: ContentType;
  tone: Tone;
  results: string[];
  createdAt: Date;
}

export const CONTENT_TYPES: { id: ContentType; label: string; labelEn: string; description: string }[] = [
  { id: "caption", label: "ক্যাপশন", labelEn: "Caption", description: "Short, punchy" },
  { id: "post", label: "পোস্ট", labelEn: "Post", description: "Full content" },
  { id: "story", label: "গল্প", labelEn: "Story", description: "Narrative" },
  { id: "bio", label: "বায়ো", labelEn: "Bio", description: "Profile bio" },
  { id: "quote", label: "উক্তি", labelEn: "Quote", description: "Inspiring" },
  { id: "ad", label: "বিজ্ঞাপন", labelEn: "Ad Copy", description: "Promotional" },
  { id: "thread", label: "থ্রেড", labelEn: "Thread", description: "Multi-part" },
];

export const TONES: { id: Tone; label: string }[] = [
  { id: "casual", label: "Casual" },
  { id: "emotional", label: "Emotional" },
  { id: "formal", label: "Formal" },
  { id: "funny", label: "Funny" },
  { id: "motivational", label: "Motivational" },
  { id: "poetic", label: "Poetic" },
  { id: "professional", label: "Professional" },
];

export const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "twitter", label: "Twitter / X" },
];

export const LANGUAGES: { id: Language; label: string; sublabel: string }[] = [
  { id: "bangla", label: "বাংলা", sublabel: "Pure Bangla" },
  { id: "banglish", label: "Banglish", sublabel: "বাংলা + English" },
  { id: "mixed", label: "Mixed", sublabel: "Smart blend" },
  { id: "english", label: "English", sublabel: "Pure English" },
];
