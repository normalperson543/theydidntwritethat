"use client";
import {
  ArrowRight,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  HourglassIcon,
  MessageSquareIcon,
  TargetIcon,
  XIcon,
} from "lucide-react";
import CircleProgress from "../components/circle-progress";
import { pfDisplay } from "../lib/fonts";
import { DisabledButton, PrimaryButton } from "../components/button";
import { FakeQuote, Quote } from "../generated/prisma/client";
import { useEffect, useRef, useState } from "react";
import { ConstructiveBanner, DestructiveBanner } from "../components/banner";
import { initGame } from "../lib/game";
import { submitActivity } from "../lib/actions";

export default function GameUI({ quotes }: { quotes: (Quote | FakeQuote)[] }) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [answerType, setAnswerType] = useState(false);
  const [progressStatus, setProgressStatus] = useState(
    Array.from({ length: 10 }, () => 0),
  );
  const [answeredAiButReal, setAnsweredAiButReal] = useState(0);
  const [answeredRealButAi, setAnsweredRealButAi] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const intervalId = useRef<NodeJS.Timeout | undefined>(undefined);
  const timeStart = useRef<number>(0);

  function startTimer() {
    stopTimers();
    timeStart.current = Date.now();
    setStarted(true);
    resumeTimer();
  }

  function resumeTimer() {
    intervalId.current = setInterval(() => {
      setTimeElapsed(Date.now() - timeStart.current);
    }, 100);
  }

  function stopTimers() {
    clearInterval(intervalId.current);
  }

  async function handleCreate() {
    setIsCreating(true);
    initGame();
  }
  async function handleAnswer(answeredReal: boolean) {
    stopTimers();
    const isReal = !("realQuote" in quotes[currentQuote])
    if (isReal === answeredReal || !isReal !== !answeredReal) {
      // correct
      const tempProgressStatus = [...progressStatus];
      tempProgressStatus[currentQuote] = 1;
      setProgressStatus(tempProgressStatus);
      setAnswerType(answeredReal);
    }
    else {
      // wrong
      const tempProgressStatus = [...progressStatus];
      tempProgressStatus[currentQuote] = 2;
      setProgressStatus(tempProgressStatus);
      setAnswerType(answeredReal);
      if ("realQuote" in quotes[currentQuote] && answeredReal) {
        setAnsweredRealButAi(answeredRealButAi + 1);
      } else {
        setAnsweredAiButReal(answeredAiButReal + 1);
      }
    }
    await submitActivity(isReal, answeredReal, Date.now() - timeStart.current)
  }

  function moveOn() {
    if (currentQuote < 10) {
      startTimer();
    } 
    setCurrentQuote(currentQuote + 1);
  }

  useEffect(() => {
    startTimer()
  }, [])
  return (
    <div className="relative h-full w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 justify-center items-center absolute top-4">
        <div className="flex gap-12 items-center">
          {progressStatus.map((p, i) => (
            <CircleProgress status={p} key={i}>
              {i + 1}
            </CircleProgress>
          ))}
        </div>
        <div className="flex gap-8 items-center text-gray-400 justify-center">
          <ClockIcon width={16} height={16} />
          {Math.floor(timeElapsed / 60000)}:
          {String(Math.floor((timeElapsed % 60000) / 1000)).padStart(2, "0")}
        </div>
      </div>
      {currentQuote === 10 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl">That&apos;s a wrap!</h2>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center text-green-700">
                <CheckIcon />
                <p className="text-2xl font-bold">
                  {progressStatus.filter((s) => s === 1).length}
                </p>
              </div>
              <p>correct</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center text-red-700">
                <XIcon />
                <p className="text-2xl font-bold">
                  {progressStatus.filter((s) => s === 2).length}
                </p>
              </div>
              <p>incorrect</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <TargetIcon />
                <p className="text-2xl font-bold">
                  {progressStatus.filter((s) => s === 1).length * 10}%
                </p>
              </div>
              <p>accuracy</p>
            </div>
          </div>
          <p>
            You said <b>{answeredRealButAi}</b> AI quotes were real quotes, and{" "}
            <b>{answeredAiButReal}</b> real quotes were written by AI.
          </p>
          <h3 className="text-2xl">How you compare</h3>
          <p>
            Your accuracy ({progressStatus.filter((s) => s === 1).length * 10}%)
          </p>
          <div
            style={{
              background: `linear-gradient(to right,#f88900 ${String(
                progressStatus.filter((s) => s === 1).length * 10,
              )}%, #462708 ${progressStatus.filter((s) => s === 1).length * 10}%)`,
            }}
            className="
                  w-full p-1 text-center font-bold text-5xl rounded-full"
          ></div>
          <p>
            Global accuracy ({progressStatus.filter((s) => s === 1).length * 10}
            %)
          </p>
          <div
            style={{
              background: `linear-gradient(to right,#f88900 ${String(
                progressStatus.filter((s) => s === 1).length * 10,
              )}%, #462708 ${progressStatus.filter((s) => s === 1).length * 10}%)`,
            }}
            className="
                  w-full p-1 text-center font-bold text-5xl rounded-full"
          ></div>
          {isCreating ? (
            <DisabledButton>
              <HourglassIcon />
              creating...
            </DisabledButton>
          ) : (
            <PrimaryButton onClick={handleCreate}>
              <ArrowRightIcon />
              play again!
            </PrimaryButton>
          )}
        </div>
      )}
      {currentQuote < 10 && (
        <div className="flex flex-col gap-4 justify-center items-center w-2/3 p-8">
          <div className="flex flex-col gap-4 w-full">
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
                <ConstructiveBanner>
                  <div className="flex gap-2 items-center">
                    <CheckIcon />
                    <p>
                      <b>Nice!</b>{" "}
                      {answerType
                        ? "This was a quote said by the author."
                        : "This quote was generated by AI."}
                    </p>
                  </div>
                  {!answerType && (
                    <p>
                      The real quote was:{" "}
                      {"realQuote" in quotes[currentQuote] &&
                        quotes[currentQuote].realQuote}
                    </p>
                  )}
                </ConstructiveBanner>
                <div className="self-end">
                  <PrimaryButton onClick={moveOn}>
                    <ArrowRight /> move on...
                  </PrimaryButton>
                </div>
              </div>
            )}
            {progressStatus[currentQuote] === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center text-gray-700">
                  <MessageSquareIcon />
                  <p>you said this quote was {answerType ? "real" : "fake"}</p>
                </div>
                <DestructiveBanner>
                  <div className="flex gap-2 items-center">
                    <XIcon />
                    <p>
                      <b>Whoops!</b>{" "}
                      {answerType
                        ? "This quote was generated by AI."
                        : "This was a quote said by the author."}
                    </p>
                  </div>
                  {answerType && (
                    <p>
                      The real quote was:{" "}
                      {"realQuote" in quotes[currentQuote] &&
                        quotes[currentQuote].realQuote}
                    </p>
                  )}
                </DestructiveBanner>
                <div className="self-end">
                  <PrimaryButton onClick={moveOn}>
                    <ArrowRight /> move on...
                  </PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
