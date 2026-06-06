"use client";
import { ArrowRightIcon, HourglassIcon } from "lucide-react";
import { DisabledButton, PrimaryButton } from "../components/button";
import { useState } from "react";
import { initGame } from "../lib/game";
import Spinner from "./spinner";

export default function CreateGameButton() {
  const [isCreating, setIsCreating] = useState(false);

  let startAudio: HTMLAudioElement;
  if (window !== undefined) {
    startAudio = new Audio("/start.mp3");
  }
  async function handleCreate() {
    setIsCreating(true);
    startAudio.play();
    try {
      initGame();
    } catch {
      setIsCreating(false);
      alert(
        "Whoops! There was a problem creating the game. Try creating one again.",
      );
    }
  }

  if (isCreating) {
    return (
      <DisabledButton>
        <Spinner />
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
