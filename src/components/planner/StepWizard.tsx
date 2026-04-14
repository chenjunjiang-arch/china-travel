'use client';

import { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { BirthInfo } from '@/types/bazi';
import { Itinerary } from '@/types/itinerary';
import { calculateBaZi } from '@/lib/bazi/calculator';
import { analyzeWuXing } from '@/lib/bazi/wuxing-analyzer';
import { mapToTravelRecommendation } from '@/lib/bazi/travel-mapper';
import { createSSEParser, parseItineraryResponse } from '@/lib/ai/response-parser';

import InkButton from '@/components/ui/InkButton';
import Disclaimer from '@/components/ui/Disclaimer';
import ProvinceSelector from './ProvinceSelector';
import DurationPicker from './DurationPicker';
import TravelPreferences, { TransportMode, TripPace } from './TravelPreferences';
import BirthInfoStep from './BirthInfoStep';
import ItineraryDisplay from './ItineraryDisplay';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const STEP_LABELS = ['选择省份', '出行偏好', '旅行天数', '生辰八字', '生成行程'];

const PACE_LABELS: Record<TripPace, string> = {
  '特种兵': '特种兵模式',
  '常规': '常规模式',
  '休闲': '休闲模式',
};

const TRANSPORT_LABELS: Record<TransportMode, string> = {
  '自驾': '自驾游',
  '飞机': '飞机出行',
  '高铁': '高铁出行',
};

export default function StepWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [transportMode, setTransportMode] = useState<TransportMode>('高铁');
  const [tripPace, setTripPace] = useState<TripPace>('常规');
  const [totalDays, setTotalDays] = useState(5);
  const [birthInfo, setBirthInfo] = useState<BirthInfo | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canProceed = () => {
    if (currentStep === 1) return selectedProvince !== null;
    if (currentStep === 2) return true; // preferences always valid
    if (currentStep === 3) return totalDays >= 1 && totalDays <= 14;
    return true;
  };

  const goNext = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleBirthInfoSubmit = (info: BirthInfo) => {
    setBirthInfo(info);
    setCurrentStep(5);
  };

  const handleSkipBirthInfo = () => {
    setBirthInfo(null);
    setCurrentStep(5);
  };

  const generateItinerary = useCallback(async () => {
    if (!selectedProvince) return;

    setIsGenerating(true);
    setError(null);
    setStreamingText('');
    setItinerary(null);

    try {
      let xiYongShen: string | undefined;
      let deficientElements: string[] | undefined;
      let foodTherapyAdvice: string | undefined;

      if (birthInfo) {
        const baziResult = calculateBaZi(birthInfo);
        const analysis = analyzeWuXing(baziResult);
        const recommendation = mapToTravelRecommendation(
          analysis.xiYongShen,
          analysis.deficientElements
        );
        xiYongShen = analysis.xiYongShen;
        deficientElements = analysis.deficientElements;
        foodTherapyAdvice = recommendation.description;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      let response: Response;
      try {
        response = await fetch('/api/generate-itinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            province: selectedProvince,
            totalDays,
            transportMode,
            tripPace,
            xiYongShen,
            deficientElements,
            foodTherapyAdvice,
          }),
        });
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        if (fetchErr instanceof DOMException && fetchErr.name === 'AbortError') {
          throw new Error('请求超时，请检查网络连接后重试');
        }
        throw new Error('网络连接失败，请检查网络后重试');
      }
      clearTimeout(timeoutId);

      if (!response.ok) {
        let serverMessage = '';
        try {
          const errBody = await response.json();
          if (errBody.error) {
            serverMessage = errBody.error;
          }
        } catch {
          // ignore parse errors
        }
        throw new Error(serverMessage || `请求失败: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('响应不包含数据流');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const parser = createSSEParser();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        parser.feed(chunk);
        setStreamingText(parser.getText());
      }

      const finalText = parser.getText();
      const parsed = parseItineraryResponse(finalText);
      if (parsed) {
        setItinerary(parsed);
        setStreamingText('');
      } else {
        setStreamingText(finalText);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成行程时出错，请重试');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedProvince, totalDays, transportMode, tripPace, birthInfo]);

  const handleRetry = () => {
    generateItinerary();
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setSelectedProvince(null);
    setTransportMode('高铁');
    setTripPace('常规');
    setTotalDays(5);
    setBirthInfo(null);
    setItinerary(null);
    setStreamingText('');
    setError(null);
    setIsGenerating(false);
  };

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {STEP_LABELS.map((label, i) => {
            const step = i + 1;
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;

            return (
              <div key={step} className="flex items-center">
                {i > 0 && (
                  <div
                    className={clsx(
                      'h-px w-4 sm:w-8 mx-0.5 sm:mx-1.5',
                      isCompleted ? 'bg-cinnabar' : 'bg-ink/15'
                    )}
                  />
                )}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={clsx(
                      'flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all',
                      isActive && 'bg-cinnabar text-white shadow-md',
                      isCompleted && 'bg-cinnabar/80 text-white',
                      !isActive && !isCompleted && 'bg-ink/10 text-ink/40'
                    )}
                  >
                    {isCompleted ? '\u2713' : step}
                  </div>
                  <span
                    className={clsx(
                      'text-[9px] sm:text-xs whitespace-nowrap',
                      isActive ? 'text-cinnabar font-medium' : 'text-ink/40'
                    )}
                  >
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {/* Step 1: Province */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-bold text-ink mb-4 text-center">选择目的地省份</h2>
            <ProvinceSelector selected={selectedProvince} onSelect={setSelectedProvince} />
          </div>
        )}

        {/* Step 2: Travel preferences */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-bold text-ink mb-6 text-center">出行偏好</h2>
            <TravelPreferences
              transportMode={transportMode}
              tripPace={tripPace}
              onTransportChange={setTransportMode}
              onPaceChange={setTripPace}
            />
          </div>
        )}

        {/* Step 3: Duration */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-bold text-ink mb-6 text-center">选择旅行天数</h2>
            <DurationPicker
              value={totalDays}
              onChange={setTotalDays}
              provinceName={selectedProvince || undefined}
            />
          </div>
        )}

        {/* Step 4: Birth info */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-xl font-bold text-ink mb-4 text-center">五行食疗（可选）</h2>
            <BirthInfoStep onSubmit={handleBirthInfoSubmit} onSkip={handleSkipBirthInfo} />
          </div>
        )}

        {/* Step 5: Generate & results */}
        {currentStep === 5 && (
          <div>
            {!isGenerating && !itinerary && !streamingText && !error && (
              <div className="text-center py-8">
                <h2 className="text-xl font-bold text-ink mb-2">准备就绪</h2>
                <p className="text-ink/60 mb-1">
                  目的地：<span className="font-medium text-ink">{selectedProvince}</span>
                  {' '}&middot;{' '}
                  天数：<span className="font-medium text-ink">{totalDays}天</span>
                </p>
                <p className="text-ink/60 mb-2">
                  <span className="font-medium text-ink">{TRANSPORT_LABELS[transportMode]}</span>
                  {' '}&middot;{' '}
                  <span className="font-medium text-ink">{PACE_LABELS[tripPace]}</span>
                  {birthInfo && (
                    <>
                      {' '}&middot;{' '}
                      <span className="text-jade">含五行食疗</span>
                    </>
                  )}
                </p>
                <div className="mt-6">
                  <InkButton size="lg" onClick={generateItinerary}>
                    生成行程
                  </InkButton>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="inline-block rounded-lg border border-cinnabar/30 bg-cinnabar/5 px-6 py-4 mb-4">
                  <p className="text-cinnabar font-medium">{error}</p>
                </div>
                <div className="flex justify-center gap-3">
                  <InkButton variant="secondary" onClick={handleRetry}>
                    重试
                  </InkButton>
                  <InkButton variant="ghost" onClick={handleStartOver}>
                    重新开始
                  </InkButton>
                </div>
              </div>
            )}

            <ItineraryDisplay
              itinerary={itinerary}
              streamingText={streamingText}
              isGenerating={isGenerating}
            />

            {(itinerary || (streamingText && !isGenerating)) && (
              <div className="flex justify-center gap-3 mt-8">
                <InkButton variant="secondary" onClick={handleRetry}>
                  重新生成
                </InkButton>
                <InkButton variant="ghost" onClick={handleStartOver}>
                  重新规划
                </InkButton>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {currentStep < 5 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-ink/10">
          <div>
            {currentStep > 1 && (
              <InkButton variant="ghost" onClick={goBack}>
                <ChevronLeft className="h-4 w-4" />
                上一步
              </InkButton>
            )}
          </div>
          <InkButton onClick={goNext} disabled={!canProceed()}>
            下一步
            <ChevronRight className="h-4 w-4" />
          </InkButton>
        </div>
      )}

      {currentStep === 5 && !isGenerating && (
        <div className="mt-4">
          <InkButton variant="ghost" onClick={goBack}>
            <ChevronLeft className="h-4 w-4" />
            上一步
          </InkButton>
        </div>
      )}

      <div className="mt-8">
        <Disclaimer message="AI生成内容仅供参考，餐厅信息和价格可能随时间变化，请出行前核实。" />
      </div>
    </div>
  );
}
