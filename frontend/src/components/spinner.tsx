import { Loader2Icon } from "lucide-react";

export function Spinner() {
  return (
    <div
      className={`inline-block animate-spin px-3 transition duration-1500 repeat-infinite`}
    >
      <Loader2Icon className="w-16 h-16" />
    </div>
  );
}
