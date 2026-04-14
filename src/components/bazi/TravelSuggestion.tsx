'use client';

import InkCard from '@/components/ui/InkCard';
import { WuXingAnalysis } from '@/lib/bazi/wuxing-analyzer';
import { WuXingElement } from '@/types/bazi';

const ELEMENT_COLORS: Record<WuXingElement, string> = {
  '金': 'text-gold',
  '木': 'text-jade',
  '水': 'text-porcelain',
  '火': 'text-cinnabar',
  '土': 'text-yellow-700',
};

const ELEMENT_BG: Record<WuXingElement, string> = {
  '金': 'bg-gold/10 border-gold/40',
  '木': 'bg-jade/10 border-jade/40',
  '水': 'bg-porcelain/10 border-porcelain/40',
  '火': 'bg-cinnabar/10 border-cinnabar/40',
  '土': 'bg-yellow-50 border-yellow-600/40',
};

interface TravelRecommendation {
  element: WuXingElement;
  destinationTypes: string[];
  foodTherapy: string[];
  direction: string;
  description: string;
}

interface TravelSuggestionProps {
  analysis: WuXingAnalysis;
  recommendation: TravelRecommendation;
}

export default function TravelSuggestion({ analysis, recommendation }: TravelSuggestionProps) {
  const element = analysis.xiYongShen;

  return (
    <div className="space-y-6">
      {/* Xi Yong Shen highlight */}
      <InkCard className={`text-center ${ELEMENT_BG[element]} border-2`}>
        <div className="text-sm text-ink/60 mb-1">喜用神</div>
        <div className={`text-4xl font-bold ${ELEMENT_COLORS[element]}`}>
          {element}
        </div>
        <p className="mt-3 text-ink/70 text-sm max-w-md mx-auto">
          {recommendation.description}
        </p>
      </InkCard>

      {/* Analysis text */}
      <InkCard>
        <h3 className="text-lg font-bold text-ink mb-3">命理分析</h3>
        <p className="text-ink/70 leading-relaxed">{analysis.analysis}</p>
      </InkCard>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Direction */}
        <InkCard>
          <h3 className="text-lg font-bold text-ink mb-3">吉利方位</h3>
          <div className={`text-2xl font-bold ${ELEMENT_COLORS[element]} mb-2`}>
            {recommendation.direction}
          </div>
          <p className="text-sm text-ink/60">
            建议优先选择{recommendation.direction}方向的旅行目的地
          </p>
        </InkCard>

        {/* Destination types */}
        <InkCard>
          <h3 className="text-lg font-bold text-ink mb-3">推荐目的地类型</h3>
          <div className="flex flex-wrap gap-2">
            {recommendation.destinationTypes.map((dest, i) => (
              <span
                key={i}
                className={`rounded-full px-3 py-1 text-sm border ${ELEMENT_BG[element]} ${ELEMENT_COLORS[element]}`}
              >
                {dest}
              </span>
            ))}
          </div>
        </InkCard>
      </div>

      {/* Food therapy */}
      <InkCard>
        <h3 className="text-lg font-bold text-ink mb-3">食疗推荐</h3>
        <p className="text-sm text-ink/50 mb-3">根据五行喜用，推荐以下食材和口味：</p>
        <div className="flex flex-wrap gap-2">
          {recommendation.foodTherapy.map((food, i) => (
            <span
              key={i}
              className="rounded-full border border-ink/15 bg-rice-paper px-3 py-1 text-sm text-ink/70"
            >
              {food}
            </span>
          ))}
        </div>
      </InkCard>
    </div>
  );
}
