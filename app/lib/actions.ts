'use server'
import { prisma } from "./db";

export async function submitActivity(quoteType: boolean, answer: boolean, timeElapsed: number) {
  return await prisma.activity.create({
    data: {
      quoteType: quoteType,
      answer: answer,
      timeElapsed: timeElapsed
    }
  })
}