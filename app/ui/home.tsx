"use client";

import { useState } from "react";
import CreateGameButton from "./create-game";
import Image from "next/image";

export default function HomeUI({
  acc,
  people,
}: {
  acc: number;
  people: number;
}) {
  const [model, setModel] = useState("google/gemma-4-31b-it:free");
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
        <CreateGameButton model={model} />
        <p className="italic text-gray-700">
          global accuracy: {acc}% - {people} players
        </p>
        <p>Change the model:</p>
        <select value={model} onChange={(e) => setModel(e.target.value)} className="border">
          <option value="openai/gpt-oss-120b:free">openai/gpt-oss-120b</option>
          <option value="google/gemma-4-31b-it:free">
            google/gemma-4-31b-it
          </option>
        </select>
      </div>
    </div>
  );
}
