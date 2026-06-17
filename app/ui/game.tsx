"use client";
import {
  ArrowRight,
  CheckIcon,
  ClockIcon,
  MessageSquareIcon,
  TargetIcon,
  XIcon,
} from "lucide-react";
import CircleProgress from "../components/circle-progress";
import { pfDisplay } from "../lib/fonts";
import { PrimaryButton } from "../components/button";
import { FakeQuote, Quote } from "../generated/prisma/client";
import { useRef, useState } from "react";
import { ConstructiveBanner, DestructiveBanner } from "../components/banner";
import { submitActivity } from "../lib/actions";
import CreateGameButton from "./create-game";

export default function GameUI({
  quotes,
  globalAccuracy,
}: {
  quotes: (Quote | FakeQuote)[];
  globalAccuracy: number;
}) {
  const [currentQuote, setCurrentQuote] = useState(-1);
  const [answerType, setAnswerType] = useState(false);
  const [progressStatus, setProgressStatus] = useState(
    Array.from({ length: 10 }, () => 0),
  );
  const [answeredAiButReal, setAnsweredAiButReal] = useState(0);
  const [answeredRealButAi, setAnsweredRealButAi] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [model, setModel] = useState("google/gemma-4-31b-it:free");

  const intervalId = useRef<NodeJS.Timeout | undefined>(undefined);
  const timeStart = useRef<number>(0);

  const correctAudio = useRef(new Audio("/correct.mp3"));
  const wrongAudio = useRef(new Audio("/wrong.mp3"));
  const completeAudio = useRef(new Audio("/complete.mp3"));
  const music = useRef(new Audio("/ingame.wav"));

  function startTimer() {
    stopTimers();
    timeStart.current = Date.now();
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

  async function handleAnswer(answeredReal: boolean) {
    setTotalTime(totalTime + Date.now() - timeStart.current);
    stopTimers();
    music.current.pause();
    const isReal = !("realQuote" in quotes[currentQuote]);
    if (isReal === answeredReal) {
      // correct
      const tempProgressStatus = [...progressStatus];
      tempProgressStatus[currentQuote] = 1;
      setProgressStatus(tempProgressStatus);
      setAnswerType(answeredReal);
      correctAudio.current.play();
    } else {
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
      wrongAudio.current.play();
    }
    await submitActivity(isReal, answeredReal, Date.now() - timeStart.current);
  }

  function moveOn() {
    if (currentQuote < 9) {
      startTimer();
      music.current.play();
    } else {
      completeAudio.current.play();
    }

    setCurrentQuote(currentQuote + 1);
  }

  function startGame() {
    moveOn();
  }

  const averageTime = totalTime / 10;

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
      {currentQuote === -1 && (
        <div className="flex flex-col gap-4 justify-center text-center">
          <p>
            There are 10 quotes. Choose whether the quote was said by a real
            person or was said by AI.
          </p>
          <PrimaryButton onClick={startGame}>
            <ArrowRight />
            start!
          </PrimaryButton>
        </div>
      )}
      {currentQuote === 10 && (
        <div className="flex flex-row gap-4 p-24 h-full">
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
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <ClockIcon />
                  <p className="text-2xl font-bold">
                    {Math.floor(averageTime / 60000)}:
                    {String(Math.floor((averageTime % 60000) / 1000)).padStart(
                      2,
                      "0",
                    )}
                  </p>
                </div>
                <p>average time</p>
              </div>
            </div>
            <p>
              You said <b>{answeredRealButAi}</b> AI quotes were real quotes,
              and <b>{answeredAiButReal}</b> real quotes were written by AI.
            </p>
            <h3 className="text-2xl">How you compare</h3>
            <p>
              Your accuracy ({progressStatus.filter((s) => s === 1).length * 10}
              %)
            </p>
            <div
              style={{
                background: `linear-gradient(to right,#0f7eff ${String(
                  progressStatus.filter((s) => s === 1).length * 10,
                )}%, #051124 ${progressStatus.filter((s) => s === 1).length * 10}%)`,
              }}
              className="
                  w-full p-1 text-center font-bold text-5xl rounded-full"
            ></div>
            <p>
              Global accuracy ({globalAccuracy * 100}
              %)
            </p>
            <div
              style={{
                background: `linear-gradient(to right,#0f7eff ${String(
                  globalAccuracy * 100,
                )}%, #051124 ${globalAccuracy * 100}%)`,
              }}
              className="
                  w-full p-1 text-center font-bold text-5xl rounded-full"
            ></div>

            <CreateGameButton model={model} />
            <p>Change the model:</p>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="border"
            >
              <option value="openai/gpt-oss-120b:free">
                openai/gpt-oss-120b
              </option>
              <option value="google/gemma-4-31b-it:free">
                google/gemma-4-31b-it
              </option>
            </select>
            <p className="text-gray-700">
              &quot;Electrodoodle&quot; Kevin MacLeod (incompetech.com) Licensed
              under Creative Commons: By Attribution 4.0 License
              http://creativecommons.org/licenses/by/4.0/
            </p>
            <p className="text-gray-700">Quotes from <a href="https://huggingface.co/datasets/Abirate/english_quotes">Abirate/english_quotes</a> on Hugging Face (modified)</p>
          </div>
          <div className="flex flex-col gap-4 max-w-120 w-full h-full">
            <h2>Quotes you got wrong</h2>
            {progressStatus.map((s, i) => {
              if (s == 2) {
                return (
                  <div
                    key={i}
                    className="bg-blue-50 border-2 border-blue-200 p-2"
                  >
                    <p>{quotes[i].quote}</p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
      {currentQuote >= 0 && currentQuote < 10 && (
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
