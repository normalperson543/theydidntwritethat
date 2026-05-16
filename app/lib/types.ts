import { Prisma } from "../generated/prisma/client"

export type GameWithQuotes = Prisma.GameGetPayload<{
  include: {
    realQuotes: true,
    fakeQuotes: true
  }
}>