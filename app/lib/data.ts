'use server'

import { prisma } from "./db"

export async function getGame(id: string) {
  const game = await prisma.game.findUnique({
    where: {
      id: id
    },
    include: {
      realQuotes: {
        select: {
          quote: true
        }
      },
      fakeQuotes: true
    }
  })
  return game
}
export async function getGlobalAccuracy() {
  const trueCount = await prisma.activity.count({
    where: {
      quoteType: true,
      answer: true
    }
  })
  const falseCount = await prisma.activity.count({
    where: {
      quoteType: false,
      answer: false
    }
  })
  const allCount = await prisma.activity.count()
  return (trueCount + falseCount) / allCount
}
export async function getActivityCount() {
  const count = await prisma.activity.count()
  return count;
}