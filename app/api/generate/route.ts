import { NextRequest, NextResponse } from "next/server";
import type { GenerateOptions } from "@/lib/types";

function buildPrompt(opts: GenerateOptions, variationIndex: number): string {
  const langInstructions: Record<string, string> = {
    bangla: "সম্পূর্ণ বাংলায় লেখো।",
    banglish: "বাংলা ও ইংরেজি মিশিয়ে লেখো।",
    mixed: "প্রধানত বাংলায় লেখো, দরকার মতো ইংরেজি শব্দ ব্যবহার করো।",
    english: "Write entirely in English.",
  };

  return `বিষয়: ${opts.topic}
কন্টেন্ট ধরন: ${opts.contentType}
টোন: ${opts.tone}
প্ল্যাটফর্ম: ${opts.platform}
ভাষা: ${langInstructions[opts.language]}
${opts.hashtags ? "শেষে প্রাসঙ্গিক হ্যাশট্যাগ যোগ করো।" : "কোনো হ্যাশট্যাগ দেবে না।"}
${opts.emoji ? "উপযুক্ত ইমোজি ব্যবহার করো।" : "ইমোজি ব্যবহার করবে না।"}
${variationIndex > 0 ? `ভ্যারিয়েশন ${variationIndex + 1} — আগেরটা থেকে সম্পূর্ণ আলাদা স্টাইলে লেখো।` : ""}

এখনই লেখা শুরু করো:`;
}

export async function POST(req: NextRequest) {
  try {
    const opts: GenerateOptions = await req.json();

    if (!opts.topic?.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const promises = Array.from({ length: opts.variations }, async (_, i) => {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "তুমি একজন expert বাংলা কন্টেন্ট রাইটার। কোনো ভূমিকা বা ব্যাখ্যা ছাড়াই সরাসরি কন্টেন্ট দাও।"
            },
            {
              role: "user",
              content: buildPrompt(opts, i)
            }
          ],
          max_tokens: 1024,
          temperature: i > 0 ? 0.9 : 0.7,
        }),
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        console.error("Groq error:", JSON.stringify(data));
        return "দুঃখিত, আবার চেষ্টা করো।";
      }
      return text;
    });

    const results = await Promise.all(promises);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

