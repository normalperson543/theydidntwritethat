import { ClockIcon } from "lucide-react";
import CircleProgress from "../components/circle-progress";

export default function Game() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col gap-4 justify-center">
        <div className="flex gap-12 items-center">
          <CircleProgress status={0}>1</CircleProgress>
          <CircleProgress status={1}/>
        </div>
        <div className="flex gap-8 items-center text-gray-400 text-center">
          <ClockIcon width={16} height={16} />
          0:09
        </div>
        <div className="text-xl font-bold">

        </div>
      </div>
    </div>
  );
}
