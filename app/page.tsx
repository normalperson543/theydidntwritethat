import Image from "next/image";
import { PrimaryButton } from "./components/button";
import { ArrowRightIcon } from "lucide-react";
import { seed } from "./lib/seed";
import { useState } from "react";

export default function Home() {
  const [isCreating, setCreating] = useState(false)
  async function handleCreate() {
    setIsCreating(true)
  }
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col gap-4">
       Was that quote written by AI or written by a human? You decide.
        <PrimaryButton onClick={handleCreate}>
          <ArrowRightIcon />
          start a game
        </PrimaryButton>
      </div>
    </div>
  );
}
