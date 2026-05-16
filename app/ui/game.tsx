"use client";
import { CheckIcon, ClockIcon, MessageSquareIcon, XIcon } from "lucide-react";
import CircleProgress from "../components/circle-progress";
import { pfDisplay } from "../lib/fonts";
import { PrimaryButton } from "../components/button";
import { FakeQuote, Game, Quote } from "../generated/prisma/client";
import { useState } from "react";
import { GameWithQuotes } from "../lib/types";

export default function GameUI({ quotes }: { quotes: (Quote | FakeQuote)[] }) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [answerType, setAnswerType] = useState(false);
  const [progressStatus, setProgressStatus] = useState([0, 0, 0, 0, 0]);

  function handleAnswer(answeredReal: boolean) {
    if (
      ("realQuote" in quotes[currentQuote] && answeredReal) ||
      (!("realQuote" in quotes[currentQuote]) && !answeredReal)
    ) {
      // wrong
      const tempProgressStatus = [...progressStatus];
      tempProgressStatus[currentQuote] = 2;
      setProgressStatus(tempProgressStatus);
    }
    if (
      (!("realQuote" in quotes[currentQuote]) && answeredReal) ||
      ("realQuote" in quotes[currentQuote] && !answeredReal)
    ) {
      // correct
      const tempProgressStatus = [...progressStatus];
      tempProgressStatus[currentQuote] = 1;
      setProgressStatus(tempProgressStatus);
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
          {quotes[currentQuote].quote}
        </div>
        <div className="text-xl text-right">
          {quotes[currentQuote].author}
        </div>
        {progressStatus[currentQuote] === 0 && (
          <div className="flex justify-around items-center w-full">
            <div className="flex flex-col gap-2">
              <PrimaryButton onClick={() => handleAnswer(true)}>
                <CheckIcon />
                This is real
              </PrimaryButton>
              I think {quotes[currentQuote].author} said this quote.
            </div>
            <div className="flex flex-col gap-2">
              <PrimaryButton onClick={() => handleAnswer(false)}>
                <XIcon />
                This is fake
              </PrimaryButton>
              {quotes[currentQuote].author} never said this quote.
            </div>
          </div>
        )}
        {progressStatus[currentQuote] === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center text-gray-700">
              <MessageSquareIcon />
              <p>you said this quote was {answerType ? "real" : "fake"}</p>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
