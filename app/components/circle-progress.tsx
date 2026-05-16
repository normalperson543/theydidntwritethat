import { CheckIcon, XIcon } from "lucide-react";

export default function CircleProgress({
  status,
  children,
}: {
  status: number;
  children?: React.ReactNode;
}) {
  if (status === 0) {
    return (
      <div className="rounded-full flex justify-center items-center border border-blue-800 bg-blue-50 text-blue-800 h-8 w-8">
        {children}
      </div>
    );
  }
  if (status === 1) {
    return (
      <div className="rounded-full flex justify-center items-center border border-green-800 bg-green-50 text-green-800 h-8 w-8">
        <CheckIcon width={16} height={16} />
      </div>
    );
  }
  return (
      <div className="rounded-full flex justify-center items-center border border-red-800 bg-red-50 text-red-800 h-8 w-8">
        <XIcon width={16} height={16} />
      </div>
    );
}
