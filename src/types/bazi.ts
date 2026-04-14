export type WuXingElement = '金' | '木' | '水' | '火' | '土';

export interface Pillar {
  tianGan: string;      // 天干
  diZhi: string;        // 地支
  tianGanWuXing: WuXingElement;
  diZhiWuXing: WuXingElement;
}

export interface BaZiResult {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
  dayMaster: string;
  dayMasterElement: WuXingElement;
  wuXingCount: Record<WuXingElement, number>;
  isStrong: boolean;
  xiYongShen: WuXingElement;    // 喜用神
  deficientElements: WuXingElement[];
}

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour?: number;  // 0-23
}
