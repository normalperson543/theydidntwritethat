"use server";
import OpenAI from "openai";
import { prisma } from "./db";
import { redirect } from "next/navigation";
export async function initGame() {
  const quoteCount = await prisma.quote.count();
  const quotes = [];
  for (let i = 0; i < 5; i++) {
    const item = await prisma.quote.findFirst({
      skip: Math.floor(Math.random() * quoteCount),
    });
    quotes.push(item);
  }
  console.log(quotes)
  const client = new OpenAI({
    apiKey: process.env["OPENAI_KEY"],
    baseURL: process.env["OPENAI_BASEURL"],
  });
  const response = await client.responses.create({
    model: process.env["OPENAI_MODEL"],
    input: `Each of the following are quotes said by popular people. For each of the following quotes, make a slightly modified version of said quote, rephrasing it to your own words. Separate each quote in between with two slashes ("//"), and keep the quotes in a separate line. Do NOT add explanations.\n
      ${quotes[0]?.quote}\n
      ${quotes[1]?.quote}\n
      ${quotes[2]?.quote}\n
      ${quotes[3]?.quote}\n
      ${quotes[4]?.quote}
    `,
  });
  const out = response.output_text;
  console.log(out)
  const outQuotes = out.split("//");
  console.log(outQuotes)
  const game = await prisma.game.create({});
  for (let i = 0; i < 5; i++) {
    if (Math.random() > 0.5) {
      console.log(outQuotes[i])
      await prisma.fakeQuote.create({
        data: {
          quote: outQuotes[i],
          author: (quotes[i]?.author as string).substring(0, ),
          realQuote: quotes[i]?.quote as string,
          gameId: game.id,
        },
      });
    } else {
      await prisma.quote.create({
        data: {
          quote: quotes[i]?.quote as string,
          author: quotes[i]?.author as string,
          gameId: game.id,
        },
      });
    }
  }
  redirect(`/game/${game.id}`);
}
