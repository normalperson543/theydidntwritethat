import { Prisma } from "../generated/prisma/client";

export type GameWithQuotes = Prisma.GameGetPayload<{
  include: {
    realQuotes: {
      select: {
        quote: true;
      };
    };
    fakeQuotes: true;
  };
}>;
