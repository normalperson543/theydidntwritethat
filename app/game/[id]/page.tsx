'use server'
import { getGame } from "@/app/lib/data";
import Game from "@/app/ui/game";
import { notFound } from "next/navigation";

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = await getGame(id)
  if (!game) notFound()
  
  const combined = [...game.fakeQuotes, ...game.realQuotes].sort(() => Math.random() - 0.5);

  return <Game quotes={combined} />
}