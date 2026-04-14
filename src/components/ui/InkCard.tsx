import { clsx } from "clsx";

interface InkCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function InkCard({
  children,
  className,
  hoverable,
  onClick,
}: InkCardProps) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-ink/10 bg-rice-paper/80 p-6 shadow-sm",
        hoverable &&
          "transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-cinnabar/30",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
