"use server";
import OpenAI from "openai";
import { prisma } from "./db";
import { redirect } from "next/navigation";
export async function initGame() {
  const quoteCount = await prisma.quote.count();
  const quotes = [];
  const quotesCount = 10;
  let quotesConcat = "";
  for (let i = 0; i < quotesCount; i++) {
    const item = await prisma.quote.findFirst({
      skip: Math.floor(Math.random() * quoteCount),
    });
    quotes.push(item);
    quotesConcat += `${item?.quote}\n`
  }
  
  const client = new OpenAI({
    apiKey: process.env["OPENAI_KEY"],
    baseURL: process.env["OPENAI_BASEURL"],
  });
  const response = await client.responses.create({
    model: process.env["OPENAI_MODEL"],
    input: `Each of the following are quotes said by popular people. For each of the following quotes, make a slightly modified version of said quote, rephrasing it to your own words. Keep the same length as the original quote. Separate each quote in between with two slashes ("//"), and keep the quotes on the same line. Do NOT add explanations. Do NOT surround the rephrased quotes with quotation marks. Do NOT add additional numbers, bullet points, or lists to your answer. Add proper punctuation to each rephrased quote.\n${quotesConcat}`,
  });
  console.log('output')
  const out = response.output_text.replace("–", " - ").replace("—","-");
  console.log(out)
  console.log("Out quotes")
  const outQuotes = out.split("//");
  console.log(outQuotes)
  const game = await prisma.game.create({});
  for (let i = 0; i < quotesCount; i++) {
    if (Math.random() > 0.5) {
      console.log(outQuotes[i])
      await prisma.fakeQuote.create({
        data: {
          quote: outQuotes[i],
          author: (quotes[i]?.author as string).substring(0, ),
          realQuote: quotes[i]?.quote as string,
          game: {
            connect: {
              id: game.id
            }
          }
        },
      });
    } else {
      await prisma.gameQuote.create({
        data: {
          gameId: game.id as string,
          quoteId: quotes[i]?.id as string
        }
      });
    }
  }
  redirect(`/game/${game.id}`);
}
