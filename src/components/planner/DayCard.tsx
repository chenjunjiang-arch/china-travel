'use client';

import { DayPlan } from '@/types/itinerary';
import MealCard from './MealCard';
import InkCard from '@/components/ui/InkCard';
import { MapPin, Clock, Bus } from 'lucide-react';

interface DayCardProps {
  dayPlan: DayPlan;
}

export default function DayCard({ dayPlan }: DayCardProps) {
  return (
    <InkCard className="relative overflow-hidden">
      {/* Day header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cinnabar text-white font-bold text-sm shrink-0">
          D{dayPlan.day}
        </div>
        <div>
          <h3 className="text-lg font-bold text-ink">
            第{dayPlan.day}天{dayPlan.date ? ` - ${dayPlan.date}` : ''}
          </h3>
          <p className="text-sm text-ink/60">
            {dayPlan.city} &middot; {dayPlan.theme}
          </p>
        </div>
      </div>

      {/* Meals - PROMINENT */}
      {dayPlan.meals && dayPlan.meals.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-ink/70 mb-2 uppercase tracking-wide">
            美食推荐
          </h4>
          <div className="grid gap-3">
            {dayPlan.meals.map((meal, i) => (
              <MealCard key={i} meal={meal} />
            ))}
          </div>
        </div>
      )}

      {/* Attractions */}
      {dayPlan.attractions && dayPlan.attractions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-ink/70 mb-2 uppercase tracking-wide">
            景点安排
          </h4>
          <div className="space-y-2">
            {dayPlan.attractions.map((attr, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md bg-jade/5 border border-jade/15 p-3">
                <MapPin className="h-4 w-4 text-jade shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-ink">{attr.name}</span>
                    {attr.duration && (
                      <span className="flex items-center gap-0.5 text-xs text-ink/40">
                        <Clock className="h-3 w-3" />
                        {attr.duration}
                      </span>
                    )}
                  </div>
                  {attr.description && (
                    <p className="text-sm text-ink/60 mt-0.5">{attr.description}</p>
                  )}
                  {attr.tips && (
                    <p className="text-xs text-jade mt-1">{attr.tips}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transportation */}
      {dayPlan.transportation && (
        <div className="flex items-center gap-2 text-sm text-ink/50 border-t border-ink/10 pt-3">
          <Bus className="h-4 w-4 shrink-0" />
          <span>{dayPlan.transportation}</span>
        </div>
      )}
    </InkCard>
  );
}
