import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { GenerateOptions } from "@/lib/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildPrompt(opts: GenerateOptions, variationIndex: number): string {
  const langInstructions = {
    bangla: "সম্পূর্ণ বাংলায় লেখো।",
    banglish: "বাংলা ও ইংরেজি মিশিয়ে (Banglish স্টাইলে) লেখো।",
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
${variationIndex > 0 ? `\nএটি ভ্যারিয়েশন ${variationIndex + 1} — আগেরগুলো থেকে সম্পূর্ণ আলাদা style ও approach এ লেখো।` : ""}

কোনো ভূমিকা বা ব্যাখ্যা ছাড়াই সরাসরি কন্টেন্ট লেখা শুরু করো:`;
}

export async function POST(req: NextRequest) {
  try {
    const opts: GenerateOptions = await req.json();

    if (!opts.topic?.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const promises = Array.from({ length: opts.variations }, (_, i) =>
      client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system:
          "তুমি একজন world-class বাংলা কন্টেন্ট রাইটার। তোমার লেখা সরাসরি, sharp, এবং platform-specific। কোনো preamble নেই, কোনো explanation নেই — শুধু কন্টেন্ট।",
        messages: [{ role: "user", content: buildPrompt(opts, i) }],
      }).then((r) => r.content[0].type === "text" ? r.content[0].text : "")
    );

    const results = await Promise.all(promises);
    return NextResponse.json({ results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
