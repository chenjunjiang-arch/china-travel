'use client';

import { AuspiciousDay } from '@/lib/calendar/auspicious-days';

interface AuspiciousCalendarProps {
  days: AuspiciousDay[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

export default function AuspiciousCalendar({ days, selectedDate, onSelect }: AuspiciousCalendarProps) {
  return (
    <div>
      <div className="grid grid-cols-3 min-[400px]:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
        {days.map((day) => {
          const isSelected = selectedDate === day.date;
          const isAuspicious = day.isAuspiciousForTravel;
          const dayNum = parseInt(day.date.split('-')[2], 10);

          return (
            <button
              key={day.date}
              onClick={() => onSelect(day.date)}
              className={`
                relative rounded-lg border p-2 sm:p-3 text-left transition-all duration-200
                cursor-pointer hover:shadow-md hover:-translate-y-0.5
                ${isSelected
                  ? 'border-cinnabar bg-cinnabar/5 ring-2 ring-cinnabar/30 shadow-md'
                  : isAuspicious
                    ? 'border-jade/40 bg-jade/5 hover:border-jade/60'
                    : 'border-ink/10 bg-rice-paper/80 hover:border-ink/20'
                }
              `}
            >
              {/* Day number */}
              <div className={`text-lg font-bold ${isAuspicious ? 'text-jade' : 'text-ink/70'}`}>
                {dayNum}
              </div>

              {/* Lunar date */}
              <div className="text-xs text-ink/50 mt-0.5 truncate">
                {day.lunarDay}
              </div>

              {/* Weekday */}
              <div className="text-xs text-ink/40 mt-0.5">
                {day.weekday}
              </div>

              {/* Auspicious indicator */}
              {isAuspicious && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-jade" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-sm text-ink/60">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-jade" />
          <span>宜出行</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-ink/20" />
          <span>普通日</span>
        </div>
      </div>
    </div>
  );
}
