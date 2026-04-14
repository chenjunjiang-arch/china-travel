'use client';

import { Meal } from '@/types/itinerary';
import { MapPin } from 'lucide-react';
import { clsx } from 'clsx';

const mealStyles: Record<string, { bg: string; border: string; badge: string; label: string }> = {
  '早餐': { bg: 'bg-gold/5', border: 'border-gold/30', badge: 'bg-gold text-white', label: '早餐' },
  '午餐': { bg: 'bg-cinnabar/5', border: 'border-cinnabar/30', badge: 'bg-cinnabar text-white', label: '午餐' },
  '晚餐': { bg: 'bg-porcelain/5', border: 'border-porcelain/30', badge: 'bg-porcelain text-white', label: '晚餐' },
  '夜宵': { bg: 'bg-ink/5', border: 'border-ink/20', badge: 'bg-ink/80 text-white', label: '夜宵' },
};

interface MealCardProps {
  meal: Meal;
}

export default function MealCard({ meal }: MealCardProps) {
  const style = mealStyles[meal.type] || mealStyles['午餐'];

  return (
    <div className={clsx('rounded-lg border p-4', style.bg, style.border)}>
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={clsx('inline-block rounded px-2 py-0.5 text-xs font-bold shrink-0', style.badge)}>
            {style.label}
          </span>
          <h4 className="text-base sm:text-lg font-bold text-ink break-words">{meal.restaurant}</h4>
        </div>
        {meal.pricePerPerson && (
          <span className="shrink-0 text-sm font-medium text-cinnabar">
            {meal.pricePerPerson}/人
          </span>
        )}
      </div>

      {meal.address && (
        <div className="flex items-center gap-1 text-sm text-ink/50 mb-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{meal.address}</span>
        </div>
      )}

      {meal.dishes && meal.dishes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {meal.dishes.map((dish, i) => (
            <span
              key={i}
              className="inline-block rounded-full border border-ink/10 bg-rice-paper px-2.5 py-0.5 text-xs text-ink/80"
            >
              {dish}
            </span>
          ))}
        </div>
      )}

      {meal.description && (
        <p className="text-sm text-ink/60 leading-relaxed">{meal.description}</p>
      )}
    </div>
  );
}
