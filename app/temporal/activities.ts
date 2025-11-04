"use server";

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export async function greet(name: string): Promise<string> {
  const result = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a poet." },
      { role: "user", content: `Write a poem about ${name}.` },
    ],
  });

  return result.choices[0].message.content ?? "Unable to generate poem.";
}
