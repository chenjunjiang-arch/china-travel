import { Solar } from 'lunar-javascript';
import { BaZiResult, BirthInfo, WuXingElement, Pillar } from '@/types/bazi';

// Map 天干 to 五行
const TIANGAN_WUXING: Record<string, WuXingElement> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// Map 地支 to 五行 (main qi)
const DIZHI_WUXING: Record<string, WuXingElement> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

function makePillar(ganZhi: string): Pillar {
  const tianGan = ganZhi.charAt(0);
  const diZhi = ganZhi.charAt(1);
  return {
    tianGan,
    diZhi,
    tianGanWuXing: TIANGAN_WUXING[tianGan],
    diZhiWuXing: DIZHI_WUXING[diZhi],
  };
}

export function calculateBaZi(birthInfo: BirthInfo): BaZiResult {
  const { year, month, day, hour } = birthInfo;

  // Create Solar date
  const solar = hour !== undefined
    ? Solar.fromYmdHms(year, month, day, hour, 0, 0)
    : Solar.fromYmd(year, month, day);

  // Convert to Lunar and get EightChar
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  // Extract four pillars
  const yearPillar = makePillar(eightChar.getYear());
  const monthPillar = makePillar(eightChar.getMonth());
  const dayPillar = makePillar(eightChar.getDay());
  const hourPillar = hour !== undefined ? makePillar(eightChar.getTime()) : null;

  // Day Master
  const dayMaster = dayPillar.tianGan;
  const dayMasterElement = TIANGAN_WUXING[dayMaster];

  // Count 五行 occurrences
  const wuXingCount: Record<WuXingElement, number> = {
    '金': 0, '木': 0, '水': 0, '火': 0, '土': 0,
  };

  const pillars = [yearPillar, monthPillar, dayPillar];
  if (hourPillar) pillars.push(hourPillar);

  for (const pillar of pillars) {
    wuXingCount[pillar.tianGanWuXing]++;
    wuXingCount[pillar.diZhiWuXing]++;
  }

  // Simplified strength analysis for isStrong and xiYongShen
  const { isStrong, xiYongShen, deficientElements } = analyzeStrength(dayMasterElement, wuXingCount);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayMaster,
    dayMasterElement,
    wuXingCount,
    isStrong,
    xiYongShen,
    deficientElements,
  };
}

// 五行生克 helpers
const GENERATED_BY: Record<WuXingElement, WuXingElement> = {
  '木': '水', '火': '木', '土': '火', '金': '土', '水': '金',
};

const KE_CYCLE: Record<WuXingElement, WuXingElement> = {
  '木': '土', '火': '金', '土': '水', '金': '木', '水': '火',
};

const SHENG_CYCLE: Record<WuXingElement, WuXingElement> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

function analyzeStrength(
  dayMasterElement: WuXingElement,
  wuXingCount: Record<WuXingElement, number>,
): { isStrong: boolean; xiYongShen: WuXingElement; deficientElements: WuXingElement[] } {
  const generatingElement = GENERATED_BY[dayMasterElement];

  // Supporting: same element + element that generates day master
  const supporting = wuXingCount[dayMasterElement] + wuXingCount[generatingElement];

  // Restraining: everything else
  const total = Object.values(wuXingCount).reduce((a, b) => a + b, 0);
  const restraining = total - supporting;

  const isStrong = supporting > restraining;

  // 喜用神: if strong, use what controls/drains; if weak, use what generates/supports
  let xiYongShen: WuXingElement;
  if (isStrong) {
    // Use the element that克s the day master (controls it), or the element day master generates (drains it)
    // Prefer the one that克s day master
    const controllingElement = GENERATED_BY[KE_CYCLE[dayMasterElement]];
    // Actually: what克s 日主? The element whose克 target is 日主.
    // 金克木, 木克土, 土克水, 水克火, 火克金
    // So what克s dayMaster = the key where KE_CYCLE[key] includes the 被克 element
    // Simpler: reverse lookup
    const CONTROLLED_BY: Record<WuXingElement, WuXingElement> = {
      '木': '金', '火': '水', '土': '木', '金': '火', '水': '土',
    };
    xiYongShen = CONTROLLED_BY[dayMasterElement];
  } else {
    // Use what generates day master
    xiYongShen = generatingElement;
  }

  // Deficient elements: those with count 0, or the lowest non-zero
  const allElements: WuXingElement[] = ['金', '木', '水', '火', '土'];
  const minCount = Math.min(...allElements.map(e => wuXingCount[e]));
  const deficientElements = allElements.filter(e => wuXingCount[e] === minCount);

  return { isStrong, xiYongShen, deficientElements };
}
