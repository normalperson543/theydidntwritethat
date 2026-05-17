'use client'
import { DisabledButton, PrimaryButton } from "./components/button";
import { ArrowRightIcon, HourglassIcon } from "lucide-react";
import { useState } from "react";
import { initGame } from "./lib/game";
import { seed } from "./lib/seed";

export default function Home() {
  const [isCreating, setIsCreating] = useState(false);
  async function handleCreate() {
    setIsCreating(true);
    initGame()
  }
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col gap-4">
        Was that quote written by AI or written by a human? You decide.
        {isCreating ? (
          <DisabledButton>
            <HourglassIcon />
            creating...
          </DisabledButton>
        ) : (
          <PrimaryButton onClick={handleCreate}>
            <ArrowRightIcon />
            start a game
          </PrimaryButton>
        )}
        <button onClick={seed}>seed!</button>
      </div>
    </div>
  );
}
