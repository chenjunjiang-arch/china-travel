'use client';

import { useState } from 'react';
import InkButton from '@/components/ui/InkButton';
import InkCard from '@/components/ui/InkCard';
import { BirthInfo } from '@/types/bazi';

const MONTHS = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
];

const SHICHEN = [
  { label: '子时 (23:00-01:00)', hour: 0 },
  { label: '丑时 (01:00-03:00)', hour: 2 },
  { label: '寅时 (03:00-05:00)', hour: 4 },
  { label: '卯时 (05:00-07:00)', hour: 6 },
  { label: '辰时 (07:00-09:00)', hour: 8 },
  { label: '巳时 (09:00-11:00)', hour: 10 },
  { label: '午时 (11:00-13:00)', hour: 12 },
  { label: '未时 (13:00-15:00)', hour: 14 },
  { label: '申时 (15:00-17:00)', hour: 16 },
  { label: '酉时 (17:00-19:00)', hour: 18 },
  { label: '戌时 (19:00-21:00)', hour: 20 },
  { label: '亥时 (21:00-23:00)', hour: 22 },
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

interface BirthDateInputProps {
  onSubmit: (birthInfo: BirthInfo) => void;
}

export default function BirthDateInput({ onSubmit }: BirthDateInputProps) {
  const [year, setYear] = useState<number>(1990);
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [shichen, setShichen] = useState<string>('');

  const maxDay = getDaysInMonth(year, month);

  // Adjust day if current selection exceeds max
  const effectiveDay = day > maxDay ? maxDay : day;

  const handleSubmit = () => {
    const birthInfo: BirthInfo = {
      year,
      month,
      day: effectiveDay,
    };
    if (shichen !== '') {
      birthInfo.hour = parseInt(shichen, 10);
    }
    onSubmit(birthInfo);
  };

  const selectClass =
    'w-full rounded-md border border-ink/20 bg-rice-paper px-3 py-2 text-ink focus:border-cinnabar focus:outline-none focus:ring-1 focus:ring-cinnabar/30';

  return (
    <InkCard className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-ink mb-4">输入出生信息</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Year */}
        <div>
          <label className="block text-sm text-ink/70 mb-1">年份</label>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className={selectClass}
          >
            {Array.from({ length: 2026 - 1940 + 1 }, (_, i) => 2026 - i).map(
              (y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              )
            )}
          </select>
        </div>

        {/* Month */}
        <div>
          <label className="block text-sm text-ink/70 mb-1">月份</label>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
            className={selectClass}
          >
            {MONTHS.map((name, i) => (
              <option key={i + 1} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Day */}
        <div>
          <label className="block text-sm text-ink/70 mb-1">日期</label>
          <select
            value={effectiveDay}
            onChange={(e) => setDay(parseInt(e.target.value, 10))}
            className={selectClass}
          >
            {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Shichen */}
        <div>
          <label className="block text-sm text-ink/70 mb-1">
            时辰 <span className="text-ink/40">(可选)</span>
          </label>
          <select
            value={shichen}
            onChange={(e) => setShichen(e.target.value)}
            className={selectClass}
          >
            <option value="">不选择</option>
            {SHICHEN.map((s) => (
              <option key={s.hour} value={s.hour}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 text-center">
        <InkButton onClick={handleSubmit} size="lg">
          开始分析
        </InkButton>
      </div>
    </InkCard>
  );
}
