// app/api/chat/route.ts
import OpenAI from "openai";
import { NextRequest } from "next/server";

export const runtime = "nodejs"; // dev дээр тогтвортой

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type UIMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages: UIMessage[] =
      (Array.isArray(body?.messages) && body.messages) ||
      (typeof body?.prompt === "string"
        ? [{ role: "user", content: body.prompt }]
        : []);

    if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY is missing — using mock response mode");
  return new Response(
    JSON.stringify({ message: "Mock: API key missing (dev mode)" }),
    { status: 200 }
  );
}

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      stream: true,
      temperature: 0.5,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        try {
          for await (const chunk of response) {
            const delta = chunk?.choices?.[0]?.delta?.content as string | undefined;
            if (delta) controller.enqueue(enc.encode(delta));
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-cache",
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: "Server error", details: e?.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
