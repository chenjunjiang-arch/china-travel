'use client';

import InkCard from '@/components/ui/InkCard';
import { AuspiciousDay } from '@/lib/calendar/auspicious-days';

interface DayDetailProps {
  day: AuspiciousDay;
}

export default function DayDetail({ day }: DayDetailProps) {
  return (
    <InkCard>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-xl font-bold text-ink">{day.date}</h3>
          <p className="text-sm text-ink/50">
            {day.lunarDate} {day.weekday}
          </p>
        </div>
        {day.isAuspiciousForTravel && (
          <span className="inline-flex items-center rounded-full bg-jade/10 border border-jade/30 px-3 py-1 text-sm font-medium text-jade w-fit">
            宜出行
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Yi list */}
        <div>
          <h4 className="text-sm font-bold text-jade mb-2">宜</h4>
          <div className="flex flex-wrap gap-1.5">
            {day.yi.map((item, i) => {
              const isTravel = item === '出行' || item === '旅游';
              return (
                <span
                  key={i}
                  className={`rounded px-2 py-0.5 text-sm ${
                    isTravel
                      ? 'bg-jade/15 text-jade font-medium border border-jade/30'
                      : 'bg-jade/5 text-jade/80'
                  }`}
                >
                  {item}
                </span>
              );
            })}
            {day.yi.length === 0 && (
              <span className="text-sm text-ink/40">无</span>
            )}
          </div>
        </div>

        {/* Ji list */}
        <div>
          <h4 className="text-sm font-bold text-cinnabar mb-2">忌</h4>
          <div className="flex flex-wrap gap-1.5">
            {day.ji.map((item, i) => (
              <span
                key={i}
                className="rounded bg-cinnabar/5 px-2 py-0.5 text-sm text-cinnabar/80"
              >
                {item}
              </span>
            ))}
            {day.ji.length === 0 && (
              <span className="text-sm text-ink/40">无</span>
            )}
          </div>
        </div>
      </div>
    </InkCard>
  );
}
