'use client';

import { clsx } from 'clsx';

interface DurationPickerProps {
  value: number;
  onChange: (days: number) => void;
  provinceName?: string;
}

const QUICK_OPTIONS = [3, 5, 7, 10, 14];

export default function DurationPicker({ value, onChange, provinceName }: DurationPickerProps) {
  return (
    <div className="max-w-lg mx-auto">
      {provinceName && (
        <p className="text-sm text-ink/60 mb-4 text-center">
          为 <span className="font-medium text-ink">{provinceName}</span> 选择旅行天数
        </p>
      )}

      {/* Current value display */}
      <div className="text-center mb-6">
        <span className="text-6xl font-bold text-cinnabar">{value}</span>
        <span className="text-2xl text-ink/60 ml-1">天</span>
      </div>

      {/* Slider */}
      <div className="mb-6 px-2">
        <input
          type="range"
          min={1}
          max={14}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-2 rounded-full appearance-none bg-ink/10 accent-cinnabar cursor-pointer"
        />
        <div className="flex justify-between text-xs text-ink/40 mt-1">
          <span>1天</span>
          <span>7天</span>
          <span>14天</span>
        </div>
      </div>

      {/* Quick select buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {QUICK_OPTIONS.map((days) => (
          <button
            key={days}
            onClick={() => onChange(days)}
            className={clsx(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer',
              value === days
                ? 'bg-cinnabar text-white shadow-md'
                : 'border border-ink/15 text-ink/70 hover:border-cinnabar/30 hover:text-cinnabar'
            )}
          >
            {days}天
          </button>
        ))}
      </div>
    </div>
  );
}
