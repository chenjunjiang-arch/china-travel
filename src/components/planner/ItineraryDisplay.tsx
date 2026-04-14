'use client';

import { Itinerary } from '@/types/itinerary';
import DayCard from './DayCard';
import StreamingIndicator from './StreamingIndicator';
import InkCard from '@/components/ui/InkCard';
import InkDivider from '@/components/ui/InkDivider';
import { Sparkles, Lightbulb } from 'lucide-react';

interface ItineraryDisplayProps {
  itinerary: Itinerary | null;
  streamingText: string;
  isGenerating: boolean;
}

export default function ItineraryDisplay({
  itinerary,
  streamingText,
  isGenerating,
}: ItineraryDisplayProps) {
  // Streaming mode
  if (isGenerating) {
    return (
      <div>
        <StreamingIndicator />
        {streamingText && (
          <InkCard className="mt-4">
            <pre className="whitespace-pre-wrap text-sm text-ink/70 font-mono leading-relaxed max-h-96 overflow-y-auto">
              {streamingText}
              <span className="animate-pulse">|</span>
            </pre>
          </InkCard>
        )}
      </div>
    );
  }

  // Completed structured mode
  if (itinerary) {
    return (
      <div className="space-y-6">
        {/* Summary banner */}
        <InkCard className="bg-gradient-to-r from-cinnabar/10 to-gold/10 border-cinnabar/20">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-cinnabar shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-ink mb-1">
                {itinerary.province} {itinerary.totalDays}天行程
              </h2>
              <p className="text-ink/70 leading-relaxed">{itinerary.summary}</p>
            </div>
          </div>
        </InkCard>

        {/* WuXing food therapy */}
        {itinerary.wuXingFoodTherapy && (
          <InkCard className="bg-jade/5 border-jade/20">
            <div className="flex items-start gap-3">
              <span className="text-2xl">&#9775;</span>
              <div>
                <h3 className="font-bold text-ink mb-1">
                  五行食疗建议 &middot; {itinerary.wuXingFoodTherapy.element}
                </h3>
                <p className="text-sm text-ink/70 leading-relaxed">
                  {itinerary.wuXingFoodTherapy.advice}
                </p>
              </div>
            </div>
          </InkCard>
        )}

        <InkDivider />

        {/* Day-by-day timeline */}
        <div className="space-y-6">
          {itinerary.days.map((dayPlan) => (
            <DayCard key={dayPlan.day} dayPlan={dayPlan} />
          ))}
        </div>

        {/* Tips */}
        {itinerary.tips && itinerary.tips.length > 0 && (
          <>
            <InkDivider />
            <InkCard>
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-ink mb-2">旅行贴士</h3>
                  <ul className="space-y-1.5">
                    {itinerary.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-ink/70 flex items-start gap-2">
                        <span className="text-cinnabar mt-0.5">&bull;</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </InkCard>
          </>
        )}
      </div>
    );
  }

  // Fallback: show raw streaming text if no parsed itinerary
  if (streamingText) {
    return (
      <InkCard>
        <h3 className="font-bold text-ink mb-3">行程规划结果</h3>
        <pre className="whitespace-pre-wrap text-sm text-ink/70 font-mono leading-relaxed">
          {streamingText}
        </pre>
      </InkCard>
    );
  }

  return null;
}
