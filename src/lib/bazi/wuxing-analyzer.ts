import { BaZiResult, WuXingElement } from '@/types/bazi';

// 五行生克关系
// 生: 木→火→土→金→水→木
// 克: 木→土→水→火→金→木

const SHENG_CYCLE: Record<WuXingElement, WuXingElement> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

const KE_CYCLE: Record<WuXingElement, WuXingElement> = {
  '木': '土', '火': '金', '土': '水', '金': '木', '水': '火',
};

// What generates this element (生我)
const GENERATED_BY: Record<WuXingElement, WuXingElement> = {
  '木': '水', '火': '木', '土': '火', '金': '土', '水': '金',
};

// What controls this element (克我)
const CONTROLLED_BY: Record<WuXingElement, WuXingElement> = {
  '木': '金', '火': '水', '土': '木', '金': '火', '水': '土',
};

// Element names in Chinese for display
const ELEMENT_NAMES: Record<WuXingElement, string> = {
  '金': '金（金属）',
  '木': '木（草木）',
  '水': '水（流水）',
  '火': '火（火焰）',
  '土': '土（大地）',
};

export interface WuXingAnalysis {
  isStrong: boolean;
  xiYongShen: WuXingElement;
  deficientElements: WuXingElement[];
  analysis: string;
}

export function analyzeWuXing(baziResult: BaZiResult): WuXingAnalysis {
  const dayMasterElement = baziResult.dayMasterElement;
  const wuXingCount = baziResult.wuXingCount;
  const generatingElement = GENERATED_BY[dayMasterElement];

  // Count supporting elements (same element + generating element / 比劫 + 印星)
  const supporting = wuXingCount[dayMasterElement] + wuXingCount[generatingElement];

  // Count restraining elements (everything else: 克我 + 我克 + 泄我)
  const allElements: WuXingElement[] = ['金', '木', '水', '火', '土'];
  const total = allElements.reduce((sum, e) => sum + wuXingCount[e], 0);
  const restraining = total - supporting;

  const isStrong = supporting > restraining;

  // Determine 喜用神
  let xiYongShen: WuXingElement;
  if (isStrong) {
    // Day master is strong → need to weaken: use controlling element (克我) or draining element (泄我/我生)
    xiYongShen = CONTROLLED_BY[dayMasterElement];
  } else {
    // Day master is weak → need to strengthen: use generating element (生我/印星)
    xiYongShen = generatingElement;
  }

  // Deficient elements: those with the lowest count
  const minCount = Math.min(...allElements.map(e => wuXingCount[e]));
  const deficientElements = allElements.filter(e => wuXingCount[e] === minCount);

  // Build analysis description
  const countDesc = allElements
    .map(e => `${e}:${wuXingCount[e]}`)
    .join('、');

  const strengthDesc = isStrong ? '偏强' : '偏弱';
  const deficientDesc = deficientElements.length > 0
    ? `缺${deficientElements.join('、')}`
    : '五行均衡';

  const analysis =
    `日主${baziResult.dayMaster}属${dayMasterElement}，` +
    `五行分布为${countDesc}。` +
    `日主${strengthDesc}，` +
    `喜用神为${ELEMENT_NAMES[xiYongShen]}。` +
    `${deficientDesc}。` +
    (isStrong
      ? `建议通过${xiYongShen}属性的活动来平衡命局。`
      : `建议通过${xiYongShen}属性的活动来增强日主力量。`);

  return {
    isStrong,
    xiYongShen,
    deficientElements,
    analysis,
  };
}
