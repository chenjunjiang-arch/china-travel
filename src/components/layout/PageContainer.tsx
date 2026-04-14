import Link from "next/link";
import { clsx } from "clsx";
import { ChevronLeft } from "lucide-react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  showBackLink?: boolean;
}

export default function PageContainer({
  children,
  className,
  title,
  showBackLink = true,
}: PageContainerProps) {
  return (
    <div
      className={clsx(
        "mx-auto max-w-6xl min-h-[calc(100vh-8rem)] px-4 py-8 pt-20",
        className
      )}
    >
      {showBackLink && (
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-ink/50 hover:text-cinnabar transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          返回首页
        </Link>
      )}
      {title && (
        <h1 className="text-3xl font-bold text-ink mb-6">{title}</h1>
      )}
      {children}
    </div>
  );
}
