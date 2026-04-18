import { NextRequest, NextResponse } from "next/server";
import type { GenerateOptions } from "@/lib/types";

function buildPrompt(opts: GenerateOptions, variationIndex: number): string {
  const langInstructions: Record<string, string> = {
    bangla: "সম্পূর্ণ বাংলায় লেখো।",
    banglish: "বাংলা ও ইংরেজি মিশিয়ে লেখো।",
    mixed: "প্রধানত বাংলায় লেখো, দরকার মতো ইংরেজি শব্দ ব্যবহার করো।",
    english: "Write entirely in English.",
  };

  return `Write ${opts.contentType} content about: ${opts.topic}
Tone: ${opts.tone}
Platform: ${opts.platform}
Language instruction: ${langInstructions[opts.language]}
${opts.hashtags ? "Add relevant hashtags at the end." : "No hashtags."}
${opts.emoji ? "Use appropriate emojis." : "No emojis."}
${variationIndex > 0 ? `This is variation ${variationIndex + 1}, write in a completely different style.` : ""}
Start writing immediately:`;
}

export async function POST(req: NextRequest) {
  try {
    const opts: GenerateOptions = await req.json();

    if (!opts.topic?.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const promises = Array.from({ length: opts.variations }, async (_, i) => {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt(opts, i) }] }],
            generationConfig: {
              maxOutputTokens: 1024,
              temperature: i > 0 ? 0.9 : 0.7,
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("Gemini raw:", JSON.stringify(data).slice(0, 500));

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.error("Empty response:", JSON.stringify(data));
        return "দুঃখিত, এই মুহূর্তে কন্টেন্ট তৈরি করা সম্ভব হয়নি। আবার চেষ্টা করো।";
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
