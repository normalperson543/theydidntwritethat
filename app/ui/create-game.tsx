'use client'
import { ArrowRightIcon, HourglassIcon } from "lucide-react";
import { DisabledButton, PrimaryButton } from "../components/button";
import { useState } from "react";
import { initGame } from "../lib/game";

export default function CreateGameButton() {
  const [isCreating, setIsCreating] = useState(false);

  const startAudio = new Audio("/start.mp3")

  async function handleCreate() {
    setIsCreating(true);
    startAudio.play()
    try {
      initGame();
    } catch {
      setIsCreating(false)
      alert("Whoops! There was a problem creating the game. Try creating one again.")
    }
  }
  
  if (isCreating) {
    return (
      <DisabledButton>
        <HourglassIcon />
        creating...
      </DisabledButton>
    );
  } else {
    return (
      <PrimaryButton onClick={handleCreate}>
        <ArrowRightIcon />
        start a game!
      </PrimaryButton>
    );
  }
}
