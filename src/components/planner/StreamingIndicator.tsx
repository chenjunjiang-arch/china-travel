'use client';

export default function StreamingIndicator({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-cinnabar animate-bounce [animation-delay:0ms]" />
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-gold animate-bounce [animation-delay:150ms]" />
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-jade animate-bounce [animation-delay:300ms]" />
      </div>
      <p className="text-ink/60 text-sm">{message || 'AI正在为您规划行程...'}</p>
    </div>
  );
}
