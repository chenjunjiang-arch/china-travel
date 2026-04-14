'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Disclaimer from '@/components/ui/Disclaimer';
import InkDivider from '@/components/ui/InkDivider';
import BirthDateInput from '@/components/bazi/BirthDateInput';
import BaZiResultDisplay from '@/components/bazi/BaZiResultDisplay';
import WuXingChart from '@/components/bazi/WuXingChart';
import TravelSuggestion from '@/components/bazi/TravelSuggestion';
import { calculateBaZi } from '@/lib/bazi/calculator';
import { analyzeWuXing, WuXingAnalysis } from '@/lib/bazi/wuxing-analyzer';
import { mapToTravelRecommendation } from '@/lib/bazi/travel-mapper';
import { BaZiResult, BirthInfo, WuXingElement } from '@/types/bazi';

interface TravelRecommendation {
  element: WuXingElement;
  destinationTypes: string[];
  foodTherapy: string[];
  direction: string;
  description: string;
}

export default function BaziPage() {
  const [result, setResult] = useState<BaZiResult | null>(null);
  const [analysis, setAnalysis] = useState<WuXingAnalysis | null>(null);
  const [recommendation, setRecommendation] = useState<TravelRecommendation | null>(null);

  const handleSubmit = (birthInfo: BirthInfo) => {
    const baziResult = calculateBaZi(birthInfo);
    const wuxingAnalysis = analyzeWuXing(baziResult);
    const travelRec = mapToTravelRecommendation(
      wuxingAnalysis.xiYongShen,
      wuxingAnalysis.deficientElements
    );

    setResult(baziResult);
    setAnalysis(wuxingAnalysis);
    setRecommendation(travelRec);
  };

  return (
    <PageContainer title="八字分析">
      <p className="text-ink/60 mb-6">
        根据您的生辰八字，分析五行喜用，推荐最适合的旅行目的地和美食。
      </p>

      <BirthDateInput onSubmit={handleSubmit} />

      {result && analysis && recommendation && (
        <div className="mt-8 space-y-6 animate-[fadeIn_0.5s_ease-out]">
          <InkDivider />

          <BaZiResultDisplay result={result} />

          <div className="max-w-lg mx-auto">
            <WuXingChart wuXingCount={result.wuXingCount} />
          </div>

          <InkDivider />

          <TravelSuggestion analysis={analysis} recommendation={recommendation} />
        </div>
      )}

      <div className="mt-8">
        <Disclaimer />
      </div>
    </PageContainer>
  );
}
