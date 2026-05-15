import OpenAI from "openai";

export async function initGame() {
  const client = new OpenAI({
    apiKey: process.env["OPENAI_KEY"],
    baseURL: process.env["OPENAI_BASEURL"],
  });
  const response = await client.responses.create({
    model: process.env["OPENAI_MODEL"],
    input: ``,
  });
}