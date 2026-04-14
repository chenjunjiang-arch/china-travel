'use client';

import InkCard from '@/components/ui/InkCard';
import { BaZiResult, Pillar, WuXingElement } from '@/types/bazi';

const ELEMENT_COLORS: Record<WuXingElement, string> = {
  '金': 'text-gold',
  '木': 'text-jade',
  '水': 'text-porcelain',
  '火': 'text-cinnabar',
  '土': 'text-yellow-700',
};

const ELEMENT_BG: Record<WuXingElement, string> = {
  '金': 'bg-gold/10 border-gold/30',
  '木': 'bg-jade/10 border-jade/30',
  '水': 'bg-porcelain/10 border-porcelain/30',
  '火': 'bg-cinnabar/10 border-cinnabar/30',
  '土': 'bg-yellow-100 border-yellow-600/30',
};

const PILLAR_NAMES = ['年柱', '月柱', '日柱', '时柱'];

interface PillarCardProps {
  pillar: Pillar | null;
  name: string;
  isDayMaster?: boolean;
}

function PillarCard({ pillar, name, isDayMaster }: PillarCardProps) {
  if (!pillar) {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm text-ink/50 mb-2">{name}</span>
        <div className="w-20 rounded-lg border border-ink/10 bg-rice-paper/50 p-3 text-center">
          <div className="text-2xl text-ink/20 mb-1">?</div>
          <div className="h-px bg-ink/10 my-2" />
          <div className="text-2xl text-ink/20">?</div>
        </div>
        <span className="text-xs text-ink/30 mt-1">未输入时辰</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm text-ink/50 mb-2">{name}</span>
      <div
        className={`w-20 rounded-lg border p-3 text-center ${
          isDayMaster ? 'border-cinnabar/50 bg-cinnabar/5 ring-2 ring-cinnabar/20' : 'border-ink/10 bg-rice-paper/80'
        }`}
      >
        {/* Tian Gan */}
        <div className="mb-1">
          <span className={`text-2xl font-bold ${ELEMENT_COLORS[pillar.tianGanWuXing]}`}>
            {pillar.tianGan}
          </span>
          <div className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs ${ELEMENT_BG[pillar.tianGanWuXing]} ${ELEMENT_COLORS[pillar.tianGanWuXing]}`}>
            {pillar.tianGanWuXing}
          </div>
        </div>

        <div className="h-px bg-ink/10 my-2" />

        {/* Di Zhi */}
        <div>
          <span className={`text-2xl font-bold ${ELEMENT_COLORS[pillar.diZhiWuXing]}`}>
            {pillar.diZhi}
          </span>
          <div className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs ${ELEMENT_BG[pillar.diZhiWuXing]} ${ELEMENT_COLORS[pillar.diZhiWuXing]}`}>
            {pillar.diZhiWuXing}
          </div>
        </div>
      </div>
      {isDayMaster && (
        <span className="text-xs text-cinnabar font-medium mt-1">日主</span>
      )}
    </div>
  );
}

interface BaZiResultDisplayProps {
  result: BaZiResult;
}

export default function BaZiResultDisplay({ result }: BaZiResultDisplayProps) {
  const pillars: (Pillar | null)[] = [result.year, result.month, result.day, result.hour];

  return (
    <InkCard>
      <h2 className="text-xl font-bold text-ink mb-6 text-center">四柱八字</h2>
      <div className="flex justify-center gap-4 sm:gap-8">
        {pillars.map((pillar, i) => (
          <PillarCard
            key={PILLAR_NAMES[i]}
            pillar={pillar}
            name={PILLAR_NAMES[i]}
            isDayMaster={i === 2}
          />
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-ink/60">
        日主 <span className={`font-bold ${ELEMENT_COLORS[result.dayMasterElement]}`}>{result.dayMaster}</span> 属
        <span className={`font-bold ${ELEMENT_COLORS[result.dayMasterElement]}`}> {result.dayMasterElement}</span>
      </div>
    </InkCard>
  );
}
