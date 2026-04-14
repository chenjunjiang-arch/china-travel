import { clsx } from "clsx";

interface InkDividerProps {
  className?: string;
}

export default function InkDivider({ className }: InkDividerProps) {
  return (
    <div className={clsx("flex items-center gap-4 my-8", className)}>
      <div className="flex-1 h-px bg-ink/15" />
      <span className="text-cinnabar/60 text-sm select-none">&#9670;</span>
      <div className="flex-1 h-px bg-ink/15" />
    </div>
  );
}
