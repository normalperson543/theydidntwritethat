"use client";
import { ArrowRightIcon } from "lucide-react";
import { DisabledButton, PrimaryButton } from "../components/button";
import { useEffect, useRef, useState } from "react";
import { initGame } from "../lib/game";
import Spinner from "./spinner";

export default function CreateGameButton({ model }: { model: string }) {
  const [isCreating, setIsCreating] = useState(false);

  const startAudio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    console.log("bloop!")
    startAudio.current = new Audio("/start.mp3");

  })
  async function handleCreate() {
    setIsCreating(true);
    startAudio.current?.play();
    try {
      initGame(model);
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
