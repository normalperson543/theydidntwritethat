"use client";

import CreateGameButton from "./create-game";
import Image from "next/image";

export default function HomeUI({ acc, people }: { acc: number, people: number }) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col gap-4 items-center">
        <Image
          src="/logo-lg.svg"
          width={360}
          height={360}
          alt="They Didn't Write That logo"
        />
        Was that quote written by AI or written by a human? You decide.
        <CreateGameButton />
        <p className="italic text-gray-700">global accuracy: {acc}% - {people} players</p>
      </div>
    </div>
  );
}
