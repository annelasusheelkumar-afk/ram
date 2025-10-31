import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ POST handler for /api/chat
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1️⃣ Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ Gemini API key is missing!");
      return NextResponse.json(
        { reply: "Server error: Gemini API key missing." },
        { status: 500 }
      );
    }

    // 2️⃣ Create model instance
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3️⃣ Generate response
    const result = await model.generateContent(message);
    const reply = result.response.text();

    // 4️⃣ Send back Gemini’s text
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("❌ Gemini API error:", error);
    return NextResponse.json(
      { reply: "Error connecting to Gemini API." },
      { status: 500 }
    );
  }
}
