import OpenAI from "openai";
import { prisma } from "./db";

export async function initGame() {
  const quoteCount = await prisma.quote.count();
  const quotes = []
  for (let i = 0; i < 5; i++) {
    const item = await prisma.quote.findFirst({
      skip: Math.floor(Math.random() * quoteCount)
    })
    quotes.push(item)
  }
  const client = new OpenAI({
    apiKey: process.env["OPENAI_KEY"],
    baseURL: process.env["OPENAI_BASEURL"],
  });
  const response = await client.responses.create({
    model: process.env["OPENAI_MODEL"],
    input: `For each of the following quotes, make a slightly modified version of said quote, rephrasing it to your own words. Keep each rephrased quote on a separate line.\n
      ${quotes[0]}\n
      ${quotes[1]}\n
      ${quotes[2]}\n
      ${quotes[3]}\n
      ${quotes[4]}
    `,
  });
  const out = response.output_text
  const outQuotes = out.split("\n");
  
}