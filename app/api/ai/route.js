import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { CoachingOptions } from "@/services/Options";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { topic, coachingOption, lastTwoConversation } = await req.json();

    // Find the selected coaching option
    const option = CoachingOptions.find((item) => item.name === coachingOption);
    if (!option) return NextResponse.json({ error: "Invalid coaching option" }, { status: 400 });

    // Replace placeholder in prompt if needed
    const promptText = option.prompt.replace("{user_topic}", topic);

    // Call Groq chat model
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: promptText,
        },
        ...lastTwoConversation
      ],
      temperature: 0.7,
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("Groq error:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
