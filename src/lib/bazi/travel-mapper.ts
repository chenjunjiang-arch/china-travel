import { WuXingElement } from '@/types/bazi';

interface TravelRecommendation {
  element: WuXingElement;
  destinationTypes: string[];
  foodTherapy: string[];
  direction: string;
  description: string;
}

// Inline fallback data in case JSON files are not yet available
const DEFAULT_DESTINATIONS: Record<WuXingElement, string[]> = {
  '金': ['西部高原', '石窟古迹', '矿山景区', '金属工艺体验'],
  '木': ['森林公园', '竹林景区', '茶园', '古树名木景点'],
  '水': ['江河湖海', '温泉度假', '水乡古镇', '瀑布景区'],
  '火': ['火山地貌', '沙漠戈壁', '红色旅游景点', '热带风光'],
  '土': ['名山大川', '古城古镇', '黄土高原', '陶瓷之乡'],
};

const DEFAULT_FOOD_THERAPY: Record<WuXingElement, string[]> = {
  '金': ['白色食物', '辛辣调味', '梨', '白萝卜', '银耳'],
  '木': ['绿色蔬菜', '酸味食物', '枸杞', '菊花茶', '青菜'],
  '水': ['黑色食物', '咸味适量', '黑芝麻', '海带', '黑豆'],
  '火': ['红色食物', '苦味养心', '红枣', '番茄', '辣椒'],
  '土': ['黄色食物', '甜味健脾', '小米', '南瓜', '山药'],
};

const DIRECTIONS: Record<WuXingElement, string> = {
  '金': '西方',
  '木': '东方',
  '水': '北方',
  '火': '南方',
  '土': '中部',
};

const DESCRIPTIONS: Record<WuXingElement, string> = {
  '金': '金主义，代表收敛、沉稳。适合前往西部地区，感受高原的壮阔与古迹的厚重。',
  '木': '木主仁，代表生长、舒展。适合前往东部地区，沉浸在森林与茶园的自然生机中。',
  '水': '水主智，代表流动、灵活。适合前往北方或水乡地区，享受江河湖海的灵动之美。',
  '火': '火主礼，代表热情、光明。适合前往南方地区，感受热带风光与人文热情。',
  '土': '土主信，代表稳重、包容。适合前往中部地区，探索名山古城的深厚底蕴。',
};

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
let wuxingDestinations: Record<string, any> | null = null;
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
let wuxingFoodTherapy: Record<string, any> | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  wuxingDestinations = require('@/data/wuxing-destinations.json');
} catch {
  wuxingDestinations = null;
}

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  wuxingFoodTherapy = require('@/data/wuxing-food-therapy.json');
} catch {
  wuxingFoodTherapy = null;
}

function getDestinations(element: WuXingElement): string[] {
  if (wuxingDestinations && wuxingDestinations[element]) {
    const data = wuxingDestinations[element];
    // JSON has nested structure: { sceneryTypes: [], activities: [], recommendedProvinces: [] }
    if (Array.isArray(data)) return data;
    return [
      ...(data.sceneryTypes || []),
      ...(data.activities || []),
    ];
  }
  return DEFAULT_DESTINATIONS[element];
}

function getFoodTherapy(element: WuXingElement): string[] {
  if (wuxingFoodTherapy && wuxingFoodTherapy[element]) {
    const data = wuxingFoodTherapy[element];
    // JSON has nested structure: { foods: [], cuisineRecommendations: [] }
    if (Array.isArray(data)) return data;
    return [
      ...(data.foods || []),
      ...(data.cuisineRecommendations || []),
    ];
  }
  return DEFAULT_FOOD_THERAPY[element];
}

export function mapToTravelRecommendation(
  xiYongShen: WuXingElement,
  deficientElements: WuXingElement[],
): TravelRecommendation {
  // Primary recommendation based on 喜用神
  const destinationTypes = [...getDestinations(xiYongShen)];
  const foodTherapy = [...getFoodTherapy(xiYongShen)];

  // Add secondary recommendations from deficient elements (if different from xiYongShen)
  for (const element of deficientElements) {
    if (element !== xiYongShen) {
      const secondaryDest = getDestinations(element);
      const secondaryFood = getFoodTherapy(element);
      // Add up to 2 items from each secondary element
      destinationTypes.push(...secondaryDest.slice(0, 2));
      foodTherapy.push(...secondaryFood.slice(0, 2));
    }
  }

  return {
    element: xiYongShen,
    destinationTypes,
    foodTherapy,
    direction: DIRECTIONS[xiYongShen],
    description: DESCRIPTIONS[xiYongShen],
  };
}
