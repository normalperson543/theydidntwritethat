import Image from "next/image";
import { PrimaryButton } from "./components/button";
import { ArrowRightIcon } from "lucide-react";
import { seed } from "./lib/seed";

export default function Home() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col gap-4">
       Was that quote written by AI or written by a human? You decide.
        <PrimaryButton>
          <ArrowRightIcon />
          start a game
        </PrimaryButton>
      </div>
    </div>
  );
}
