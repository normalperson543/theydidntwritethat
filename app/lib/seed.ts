'use server'
import { prisma } from "./db";
import quotes from "./quotes.json"
export async function seed() {
  for (let i = 0; i < quotes.length; i++) {
    await prisma.quote.create({
      data: {
        quote: quotes[i].quote,
        author: quotes[i].author
      }
    })
    console.log(i)
  }
}