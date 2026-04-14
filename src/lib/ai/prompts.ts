import { WuXingElement } from '@/types/bazi';
import provincesData from '@/data/provinces.json';

interface PromptContext {
  province: string;
  totalDays: number;
  transportMode?: '自驾' | '飞机' | '高铁';
  tripPace?: '特种兵' | '常规' | '休闲';
  provinceData?: typeof provincesData[number];
  xiYongShen?: WuXingElement;
  deficientElements?: WuXingElement[];
  foodTherapyAdvice?: string;
}

const ITINERARY_JSON_SCHEMA = `{
  "province": "省份名称",
  "totalDays": 天数,
  "summary": "行程概要描述",
  "wuXingFoodTherapy": {
    "element": "五行元素（金/木/水/火/土）",
    "advice": "食疗建议"
  },
  "days": [
    {
      "day": 1,
      "date": "可选日期",
      "city": "城市名称",
      "theme": "当日主题",
      "meals": [
        {
          "type": "早餐|午餐|晚餐|夜宵",
          "restaurant": "具体餐厅名称",
          "address": "详细地址（精确到街道门牌号）",
          "dishes": ["招牌菜1", "招牌菜2", "招牌菜3"],
          "pricePerPerson": "人均价格，如：50元",
          "description": "餐厅特色描述"
        }
      ],
      "attractions": [
        {
          "name": "景点名称",
          "description": "景点描述",
          "duration": "建议游览时长，如：2小时",
          "tips": "可选的游览贴士"
        }
      ],
      "transportation": "可选的交通建议"
    }
  ],
  "tips": ["旅行贴士1", "旅行贴士2"]
}`;

function buildProvinceContext(province: string): string {
  const data = provincesData.find(
    (p) => p.name === province || p.shortName === province,
  );

  if (!data) return '';

  const cityInfo = data.cities
    .map((c) => {
      const dishes = c.dishes.map((d) => d.name).join('、');
      const attractions = c.attractions.join('、');
      return `  - ${c.name}：${c.description}\n    景点：${attractions}\n    美食：${dishes}`;
    })
    .join('\n');

  return `
【${data.name}旅游参考信息】
简称：${data.shortName}
省会：${data.capital}
概述：${data.description}
菜系特色：${data.cuisineStyle}
最佳旅游季节：${data.bestSeasons.join('、')}
主要城市：
${cityInfo}
`;
}

function buildBaZiContext(context: PromptContext): string {
  if (!context.xiYongShen && !context.deficientElements?.length) return '';

  let text = '\n【八字五行食疗信息】\n';

  if (context.xiYongShen) {
    text += `喜用神五行：${context.xiYongShen}\n`;
  }

  if (context.deficientElements?.length) {
    text += `缺失五行：${context.deficientElements.join('、')}\n`;
  }

  if (context.foodTherapyAdvice) {
    text += `食疗建议：${context.foodTherapyAdvice}\n`;
  }

  text += '请在推荐餐食时，优先考虑符合上述五行食疗建议的食材和菜品，并在行程中体现五行食疗的理念。\n';

  return text;
}

function buildTravelPrefsContext(context: PromptContext): string {
  let text = '';

  if (context.transportMode) {
    const transportDesc: Record<string, string> = {
      '自驾': '用户选择自驾出行。请根据自驾特点安排行程：可以安排偏远/小众景点，标注驾车距离和时间，提醒停车信息，不需要考虑公共交通衔接。',
      '飞机': '用户选择飞机出行。请安排机场接驳交通，市内建议打车或地铁，跨城市优先推荐航班衔接。',
      '高铁': '用户选择高铁出行。请围绕高铁站规划行程，跨城市优先安排高铁衔接，市内建议地铁/公交/打车。',
    };
    text += `\n【交通方式】\n${transportDesc[context.transportMode]}\n`;
  }

  if (context.tripPace) {
    const paceDesc: Record<string, string> = {
      '特种兵': '用户选择"特种兵"模式（最紧凑）。每天早7点出发，晚10点回酒店。每天安排4-6个景点，行程排满，不留空闲时间，追求最大化体验。可安排夜宵。',
      '常规': '用户选择"常规"模式（中等节奏）。每天早9点出发，晚9点回酒店。每天安排2-4个景点，节奏适中，留有休息和自由活动时间。',
      '休闲': '用户选择"休闲"模式（最轻松）。每天早11点出门，晚8点回酒店。每天安排1-2个景点，大量自由时间，重点在美食和慢节奏体验。午餐可以晚一些，以brunch形式呈现。',
    };
    text += `\n【行程节奏】\n${paceDesc[context.tripPace]}\n`;
  }

  return text;
}

export function buildItineraryPrompt(context: PromptContext): {
  system: string;
  user: string;
} {
  const provinceContext = buildProvinceContext(context.province);
  const baziContext = buildBaZiContext(context);
  const prefsContext = buildTravelPrefsContext(context);

  const system = `你是一位资深的中国旅游规划师和美食家，精通中国各地的风土人情、名胜古迹和地方美食。你的任务是根据用户需求生成详细的旅行行程。

## 核心规则

1. **三餐推荐是最高优先级**，每天必须包含早餐、午餐、晚餐三餐推荐
2. 只推荐2021-2026年间仍在营业的餐厅和开放的景点
3. 每餐必须推荐：
   - 具体餐厅名称（真实存在的餐厅）
   - 详细地址（精确到街道门牌号）
   - 2-3道招牌菜
   - 人均价格
   - 餐厅特色描述
4. 早餐推荐当地早市或特色早点铺
5. 午餐推荐正餐餐厅（当地知名餐馆）
6. 晚餐推荐夜市或大排档或当地特色晚餐店
7. 根据用户选择的行程节奏合理安排景点数量和时间
8. 根据用户选择的交通方式安排城际交通和市内出行
9. 提供实用的旅行贴士（交通、天气、注意事项等）

## 五行食疗
如果提供了八字五行信息，请将五行食疗建议融入餐食推荐中，选择符合五行养生的食材和菜品。

## 输出格式

你必须且只能输出一个合法的JSON对象，不要包含任何其他文字、解释或markdown标记。JSON结构如下：

${ITINERARY_JSON_SCHEMA}

重要：
- 直接输出JSON，不要用\`\`\`json\`\`\`包裹
- 确保JSON格式完全合法，所有字符串使用双引号
- meals数组中type字段只能是以下值之一："早餐"、"午餐"、"晚餐"、"夜宵"
- 每天至少包含3个meal（早餐、午餐、晚餐）
- transportation字段要写明具体的出行方式和时间`;

  const user = `请为我规划一个${context.province}${context.totalDays}天的旅行行程。
${prefsContext}${provinceContext}${baziContext}
请生成完整的JSON格式行程，包含每日三餐的具体餐厅推荐和景点安排。`;

  return { system, user };
}
