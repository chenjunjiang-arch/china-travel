import { Solar } from 'lunar-javascript';

export interface AuspiciousDay {
  date: string;          // YYYY-MM-DD
  lunarDate: string;     // 农历日期
  lunarMonth: string;    // 农历月
  lunarDay: string;      // 农历日
  weekday: string;       // 星期几
  yi: string[];          // 宜
  ji: string[];          // 忌
  isAuspiciousForTravel: boolean;
}

const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

// Keywords in 宜 that indicate a good day for travel
const TRAVEL_KEYWORDS = ['出行', '旅游'];

export function getAuspiciousDays(days: number = 30): AuspiciousDay[] {
  const result: AuspiciousDay[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const weekdayIndex = currentDate.getDay();

    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();

    const yi = lunar.getDayYi();
    const ji = lunar.getDayJi();

    const isAuspiciousForTravel = TRAVEL_KEYWORDS.some(keyword => yi.includes(keyword));

    // Format date as YYYY-MM-DD
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const lunarMonth = lunar.getMonthInChinese();
    const lunarDay = lunar.getDayInChinese();

    result.push({
      date: dateStr,
      lunarDate: `${lunarMonth}月${lunarDay}`,
      lunarMonth: `${lunarMonth}月`,
      lunarDay: lunarDay,
      weekday: WEEKDAY_NAMES[weekdayIndex],
      yi,
      ji,
      isAuspiciousForTravel,
    });
  }

  return result;
}
