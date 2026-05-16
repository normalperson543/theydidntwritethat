'use server'

import { prisma } from "./db"

export async function getGame(id: string) {
  return await prisma.game.findUnique({
    where: {
      id: id
    },
    include: {
      realQuotes: true,
      fakeQuotes: true
    }
  })
}
