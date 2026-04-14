'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Disclaimer from '@/components/ui/Disclaimer';
import InkDivider from '@/components/ui/InkDivider';
import AuspiciousCalendar from '@/components/auspicious/AuspiciousCalendar';
import DayDetail from '@/components/auspicious/DayDetail';
import { getAuspiciousDays, AuspiciousDay } from '@/lib/calendar/auspicious-days';

export default function AuspiciousPage() {
  const [days, setDays] = useState<AuspiciousDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use requestAnimationFrame to avoid blocking the UI during calculation
    const id = requestAnimationFrame(() => {
      const auspiciousDays = getAuspiciousDays(30);
      setDays(auspiciousDays);
      setIsLoading(false);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const selectedDay = days.find((d) => d.date === selectedDate) ?? null;

  const auspiciousCount = days.filter((d) => d.isAuspiciousForTravel).length;

  return (
    <PageContainer title="黄道吉日">
      <p className="text-ink/60 mb-6">
        查看近期宜出行的黄道吉日，选择最佳出发日期。
      </p>

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-cinnabar animate-bounce [animation-delay:0ms]" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-gold animate-bounce [animation-delay:150ms]" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-jade animate-bounce [animation-delay:300ms]" />
          </div>
          <p className="text-ink/50 text-sm">正在推算黄道吉日...</p>
        </div>
      ) : days.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-ink/50">
            未来30天内有 <span className="text-jade font-bold">{auspiciousCount}</span> 天宜出行，点击日期查看详情。
          </div>

          <AuspiciousCalendar
            days={days}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />

          {selectedDay && (
            <>
              <InkDivider />
              <DayDetail day={selectedDay} />
            </>
          )}
        </>
      ) : null}

      <div className="mt-8">
        <Disclaimer />
      </div>
    </PageContainer>
  );
}
