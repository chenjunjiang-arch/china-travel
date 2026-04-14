'use client';

import { WuXingElement } from '@/types/bazi';

const ELEMENT_CONFIG: Record<WuXingElement, { label: string; color: string; bg: string }> = {
  '金': { label: '金', color: 'text-gold', bg: 'bg-gold' },
  '木': { label: '木', color: 'text-jade', bg: 'bg-jade' },
  '水': { label: '水', color: 'text-porcelain', bg: 'bg-porcelain' },
  '火': { label: '火', color: 'text-cinnabar', bg: 'bg-cinnabar' },
  '土': { label: '土', color: 'text-yellow-700', bg: 'bg-yellow-600' },
};

const ELEMENTS: WuXingElement[] = ['金', '木', '水', '火', '土'];

interface WuXingChartProps {
  wuXingCount: Record<WuXingElement, number>;
}

export default function WuXingChart({ wuXingCount }: WuXingChartProps) {
  const maxCount = Math.max(...ELEMENTS.map((e) => wuXingCount[e]), 1);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-ink mb-4 text-center">五行分布</h3>
      {ELEMENTS.map((element) => {
        const count = wuXingCount[element];
        const widthPercent = (count / maxCount) * 100;
        const config = ELEMENT_CONFIG[element];

        return (
          <div key={element} className="flex items-center gap-3">
            <span className={`w-8 text-center text-lg font-bold ${config.color}`}>
              {config.label}
            </span>
            <div className="flex-1 h-8 rounded-md bg-ink/5 overflow-hidden relative">
              <div
                className={`h-full rounded-md ${config.bg} transition-all duration-500 ease-out`}
                style={{ width: `${Math.max(widthPercent, 4)}%`, opacity: count === 0 ? 0.2 : 0.7 }}
              />
              <span className="absolute inset-y-0 right-2 flex items-center text-sm font-medium text-ink/70">
                {count}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
