'use client'
import { CheckIcon, ClockIcon, XIcon } from "lucide-react";
import CircleProgress from "../components/circle-progress";
import { pfDisplay } from "../lib/fonts";
import { PrimaryButton } from "../components/button";
import { Game } from "../generated/prisma/client";
import { useState } from "react";
import { GameWithQuotes } from "../lib/types";

export default function GameUI({gameInfo}: {gameInfo: GameWithQuotes}) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [currentGame, setCurrentGame] = useState( [...gameInfo.realQuotes, ...gameInfo.fakeQuotes].sort(() => Math.random() - 0.5)) // this used ai
  const [progressStatus, setProgressStatus] = useState([0,0,0,0,0]);

  function handleAnswer(answeredReal: boolean) {
    if ("realQuote" in currentGame[currentQuote]) {
      // wrong
      progressStatus[currentQuote] = 2
    } else {
      // correct
      progressStatus[currentQuote] = 1
    }
  }
  return (
    <div className="relative h-full w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 justify-center items-center w-2/3 p-8">
        <div className="flex gap-12 items-center">
          <CircleProgress status={0}>1</CircleProgress>
          <CircleProgress status={1} />
        </div>
        <div className="flex gap-8 items-center text-gray-400 justify-center">
          <ClockIcon width={16} height={16} />
          0:09
        </div>
        <div className={`text-3xl font-bold ${pfDisplay.className}`}>
          This is a quote
        </div>
        <div className="text-xl text-right">Ernest Hemingway</div>
        <div className="flex justify-around items-center w-full">
          <div className="flex flex-col gap-2">
            <PrimaryButton>
              <CheckIcon />
              This is real
            </PrimaryButton>
            I think Ernest Hemingway said this quote.
          </div>
          <div className="flex flex-col gap-2">
            <PrimaryButton>
              <XIcon />
              This is fake
            </PrimaryButton>
            Ernest Hemingway never said this quote.
          </div>
        </div>
      </div>
    </div>
  );
}
