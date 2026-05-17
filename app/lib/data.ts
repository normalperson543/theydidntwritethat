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
  console.log(game)
  return game
}
