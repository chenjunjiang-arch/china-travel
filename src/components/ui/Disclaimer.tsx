import { clsx } from "clsx";
import { Info } from "lucide-react";

interface DisclaimerProps {
  message?: string;
  className?: string;
}

export default function Disclaimer({
  message = "本系统基于传统文化算法，仅供娱乐参考，不构成任何专业建议。",
  className,
}: DisclaimerProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-md border border-gold/30 bg-gold/5 px-4 py-2 text-sm text-ink/70",
        className
      )}
    >
      <Info className="h-4 w-4 shrink-0 text-gold" />
      <p>{message}</p>
    </div>
  );
}
