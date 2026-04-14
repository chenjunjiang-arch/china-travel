'use client';

import BirthDateInput from '@/components/bazi/BirthDateInput';
import InkButton from '@/components/ui/InkButton';
import { BirthInfo } from '@/types/bazi';
import { Info } from 'lucide-react';

interface BirthInfoStepProps {
  onSubmit: (birthInfo: BirthInfo) => void;
  onSkip: () => void;
}

export default function BirthInfoStep({ onSubmit, onSkip }: BirthInfoStepProps) {
  return (
    <div>
      <div className="flex items-center gap-2 rounded-md border border-porcelain/30 bg-porcelain/5 px-4 py-2 text-sm text-ink/70 mb-6 max-w-2xl mx-auto">
        <Info className="h-4 w-4 shrink-0 text-porcelain" />
        <p>输入生辰八字可获取五行食疗推荐（可选）</p>
      </div>

      <BirthDateInput onSubmit={onSubmit} />

      <div className="text-center mt-4">
        <InkButton variant="ghost" onClick={onSkip}>
          跳过此步骤
        </InkButton>
      </div>
    </div>
  );
}
